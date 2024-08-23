package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class CRMNewContactFacilityPage {
	WebDriver driver;

	@FindBy(xpath = "//input[@aria-label='Contact, Lookup']")
	WebElement addContact;
	
	@FindBy(xpath = "//input[contains(@aria-label, 'Portal Access')]")
	WebElement portalAccessToggle;
	
	@FindBy(xpath = "//button[@aria-label='Save & Close']")
	WebElement saveAndClose;
	
	public CRMNewContactFacilityPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}

	public void addNewContact(String name) throws Exception {
		addContact.click();
		Thread.sleep(1000);
		addContact.clear();
		addContact.sendKeys(name);
		Thread.sleep(2000);
		driver.findElement(By.xpath("//ul[@aria-label = 'Lookup results']")).click();

	}
	
	public void togglePortalAccess() {
		portalAccessToggle.click();
	}

	public void saveAndClose() {
		saveAndClose.click();
	}
}
