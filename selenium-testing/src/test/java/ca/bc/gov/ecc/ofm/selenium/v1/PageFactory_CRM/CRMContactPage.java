package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class CRMContactPage {
	WebDriver driver;
	WebDriverWait wait;

	@FindBy(xpath = "//input[@type = 'text' and @aria-label='BCeID']")
	WebElement bceid;
	
	@FindBy(xpath = "//input[@aria-label='Portal Role, Lookup']")
	WebElement portalRole;
	
	@FindBy(xpath = "//input[@type = 'text' and @aria-label='First Name']")
	WebElement firstName;
	
	@FindBy(xpath = "//input[@type = 'text' and @aria-label='Last Name']")
	WebElement lastName;
	
	@FindBy(xpath = "//input[@type = 'tel' and @aria-label='Business Phone']")
	WebElement phoneNumber;
	
	@FindBy(xpath = "//input[@type = 'email' and @aria-label='Email']")
	WebElement email;
	
	@FindBy(xpath = "//button[@type = 'button' and @title = 'Ignore and save']")
	WebElement ignoreAndSave;
	
	@FindBy(xpath = "//button[@aria-label='Save & Close']")
	WebElement saveAndClose;

	public CRMContactPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public void enterBCeID(String name) {
		wait.until(ExpectedConditions.elementToBeClickable(bceid));
		bceid.sendKeys(name);
	}
	
	public void enterPortalRole(String role) throws Exception {
		wait.until(ExpectedConditions.elementToBeClickable(portalRole));
		portalRole.click();
		portalRole.clear();
		portalRole.sendKeys(role);
		wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//ul[@aria-label = 'Lookup results']"))).click();
	}
	
	public void enterFirstName(String name) {
		wait.until(ExpectedConditions.elementToBeClickable(firstName));
		firstName.sendKeys(name);
	}
	
	public void enterLastName(String name) {
		wait.until(ExpectedConditions.elementToBeClickable(lastName));
		lastName.sendKeys(name);
	}
	
	public void enterEmail(String name) {
		wait.until(ExpectedConditions.elementToBeClickable(email));
		email.sendKeys(name);
	}
	
	public void enterPhoneNumber(String number) {
		wait.until(ExpectedConditions.elementToBeClickable(phoneNumber));
		phoneNumber.sendKeys(number);
	}
	
	public void saveAndClose() {
		wait.until(ExpectedConditions.elementToBeClickable(saveAndClose)).click();
	}
	
	public void ignoreAndSave() {
		try {
			wait.until(ExpectedConditions.elementToBeClickable(ignoreAndSave)).click();	
		} catch (Exception e) {
			System.out.println("No duplicates to ignore and save");
		}
	}
}
