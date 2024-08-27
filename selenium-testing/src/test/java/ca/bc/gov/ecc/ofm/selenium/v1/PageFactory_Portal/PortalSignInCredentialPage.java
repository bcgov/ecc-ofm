package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal;

import java.time.Duration;
import java.util.Base64;
import java.util.NoSuchElementException;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PortalSignInCredentialPage {
	WebDriver driver;
	WebDriverWait wait;

	@FindBy(name = "user")
	WebElement text_userID;

	@FindBy(name = "password")
	WebElement text_password;

	@FindBy(name = "btnSubmit")
	WebElement button_btnSubmit;

	@FindBy(id = "dialog-go-back")
	WebElement button_signatureRequired;
	
	@FindBy(xpath = "//input[@type = 'submit' and @value = 'Continue']")
	WebElement continueButton;

	public PortalSignInCredentialPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver,  Duration.ofMillis(10000));
	}

	public void enterUserId(String userid) {
		wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[@name = 'user']")));
		text_userID.sendKeys(userid);
	}

	public void enterPassword(String encodedPassword) {
		byte[] decodedBytes = Base64.getDecoder().decode(encodedPassword);
		String decoded_password = new String(decodedBytes);
		wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[@name = 'password']")));
		text_password.sendKeys(decoded_password);
	}

	public void clickSubmit() {
		wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[@name = 'btnSubmit']")));
		button_btnSubmit.click();
	}

	public void clickSignatureRequired() {
		try {
			wait.until(ExpectedConditions.presenceOfElementLocated(By.id("dialog-go-back")));
			button_signatureRequired.click();
		}
		catch (Exception e) {
			System.out.println("No signature needed");
		}

	}
	
	public void continueButton() {
		try {
			wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[@type = 'submit' and @value = 'Continue']")));
			continueButton.click();
		}
		catch (Exception e) {
			System.out.println("No login history needed");
		}
	}

}