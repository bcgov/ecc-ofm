package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal;

import java.time.Duration;
import java.util.Base64;
import java.util.NoSuchElementException;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PortalSignInCredentialPage {
	WebDriver driver;

	@FindBy(name = "user")
	WebElement text_userID;

	@FindBy(name = "password")
	WebElement text_password;

	@FindBy(name = "btnSubmit")
	WebElement button_btnSubmit;

	@FindBy(id = "dialog-go-back")
	WebElement button_signatureRequired;

	public PortalSignInCredentialPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}

	public void enterUserId(String userid) {
		text_userID.sendKeys(userid);
	}

	public void enterPassword(String encodedPassword) {
		byte[] decodedBytes = Base64.getDecoder().decode(encodedPassword);
		String decoded_password = new String(decodedBytes);
		text_password.sendKeys(decoded_password);
	}

	public void clickSubmit() {
		button_btnSubmit.click();
	}

	public void clickSignatureRequired() {
		try {
			if (button_signatureRequired.isDisplayed())
				button_signatureRequired.click();
		}

		catch (NoSuchElementException e) {
			System.out.println("Element does not exist.");
		}

	}

}