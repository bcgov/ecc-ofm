package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM;

import java.time.Duration;
import java.util.Base64;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LicenseDetailsPage {
	WebDriver driver;
	WebDriverWait wait;
	
	@FindBy(xpath = "//*[@aria-label='Licence Number']")
	WebElement licenseNumberField;
	
	@FindBy(xpath = "//*[@aria-label='Health Authority']")
	WebElement HealthAuthorityButton;
	
	@FindBy(xpath = "//*[text()='Fraser Health']")
	WebElement HealthAuthorityOption;
	
	@FindBy(xpath = "//*[@aria-label='Date of Start Date']")
	WebElement startDateButton;
	
	@FindBy(xpath = "//span[text()='1']")
	WebElement startDateOption;
	
	@FindBy(xpath = "//*[@aria-label='Save (CTRL+S)']")
	WebElement saveButton;
	
	@FindBy(xpath = "//*[@aria-label='Save & Close']")
	WebElement saveAndCloseButton;
	
	@FindBy(xpath = "//*[@aria-label='New Service Delivery Detail. Add New Service Delivery Detail']")
	WebElement newServiceDeliveryDetail;
	
	
	public LicenseDetailsPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}
	
	public void setLicenseNumber(String licenseNumber) {
		licenseNumberField.sendKeys(licenseNumber);
	}
	
	public void setHealthAuthority() {
		wait.until(ExpectedConditions.visibilityOf(HealthAuthorityButton)).click();
		wait.until(ExpectedConditions.visibilityOf(HealthAuthorityOption)).click();
	}
	
	public void setStartDate() {
		wait.until(ExpectedConditions.visibilityOf(startDateButton)).click();
		wait.until(ExpectedConditions.visibilityOf(startDateOption)).click();
	}
	
	public void saveLicense() {
		wait.until(ExpectedConditions.visibilityOf(saveButton)).click();
	}
	
	public void saveAndCloseLicense() {
		wait.until(ExpectedConditions.visibilityOf(saveAndCloseButton)).click();
	}
	
	public void addNewSDD() {
		wait.until(ExpectedConditions.visibilityOf(newServiceDeliveryDetail)).click();
	}
}