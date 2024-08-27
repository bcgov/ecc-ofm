package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class CRMNewContactFacilityPage {
	WebDriver driver;
	WebDriverWait wait;

	@FindBy(xpath = "//input[@aria-label='Contact, Lookup']")
	WebElement addContact;
	
	@FindBy(xpath = "//input[contains(@aria-label, 'Portal Access')]")
	WebElement portalAccessToggle;
	
	@FindBy(xpath = "//button[@aria-label='Save & Close']")
	WebElement saveAndClose;
	
	public CRMNewContactFacilityPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public void addNewContact(String name) throws Exception {
		wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[@aria-label='Contact, Lookup']")));
		addContact.click();
		addContact.clear();
		addContact.sendKeys(name);
		wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//ul[@aria-label = 'Lookup results']"))).click();
	}
	
	public void togglePortalAccess() {
		wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[contains(@aria-label, 'Portal Access')]")));
		portalAccessToggle.click();
	}

	public void saveAndClose() {
		wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//button[@aria-label='Save & Close']")));
		saveAndClose.click();
	}
}
