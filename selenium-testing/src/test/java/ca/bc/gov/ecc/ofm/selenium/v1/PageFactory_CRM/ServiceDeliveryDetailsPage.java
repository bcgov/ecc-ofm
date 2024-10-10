package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM;

import java.time.Duration;
import java.util.Base64;

import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ServiceDeliveryDetailsPage {
	WebDriver driver;
	WebDriverWait wait;
	
	@FindBy(xpath = "//*[@aria-label='Licence Type']")
	WebElement licenseTypeField;
	
	@FindBy(xpath = "//*[text()='Group Child Care (Under 36 Months)']")
	WebElement licenseTypeOption;
	
	@FindBy(xpath = "//*[@aria-label='Weeks in Operation']")
	WebElement weeksInOperationField;
	
	@FindBy(id = "ofm_week_days_ledit")
	WebElement daysOfWeekField;
	
	@FindBy(xpath = "//*[text()='Monday']")
	WebElement daysOfWeekOption;
	
	@FindBy(xpath = "//*[@aria-label='Hours of Operation From']")
	WebElement hoursOfOperationFromField;
	
	@FindBy(xpath = "//*[@aria-label='Hours of Operation To']")
	WebElement hoursOfOperationToField;
	
	@FindBy(xpath = "//*[@aria-label='Licensed Spaces']")
	WebElement licenseSpacesField;
	
	@FindBy(xpath = "//*[@aria-label='Operational Spaces']")
	WebElement operationalSpacesField;
	
	@FindBy(xpath = "//*[@aria-label='Enrolled Spaces']")
	WebElement enrolledSpacesField;
	
	@FindBy(xpath = "//*[@aria-label='Save & Close']")
	WebElement saveAndCloseButton;
	
	
	public ServiceDeliveryDetailsPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}
	
	public void setLicenceType() {
		wait.until(ExpectedConditions.visibilityOf(licenseTypeField)).click();
		wait.until(ExpectedConditions.visibilityOf(licenseTypeOption)).click();
	}
	
	public void setWeeksInOperation(String weeksInOperation) {
		weeksInOperationField.sendKeys(weeksInOperation);
	}
	
	public void setDaysOfWeek(String daysOfWeek) {
		daysOfWeekField.sendKeys(daysOfWeek);
		wait.until(ExpectedConditions.visibilityOf(daysOfWeekOption)).click();
		daysOfWeekField.sendKeys(Keys.ESCAPE);
	}
	
	public void setHoursOfOperationFrom(String hoursOfOperationFrom) {
		wait.until(ExpectedConditions.visibilityOf(hoursOfOperationFromField)).click();
		hoursOfOperationFromField.sendKeys(hoursOfOperationFrom);
	}
	
	public void setHoursOfOperationTo(String hoursOfOperationTo) {
		wait.until(ExpectedConditions.visibilityOf(hoursOfOperationToField)).click();
		hoursOfOperationToField.sendKeys(hoursOfOperationTo);
	}
	
	public void setLicenseSpaces(String licenseSpaces) {
		licenseSpacesField.sendKeys(licenseSpaces);
	}
	
	public void setOperationalSpaces(String operationalSpaces) {
		operationalSpacesField.sendKeys(operationalSpaces);
	}
	
	public void setEnrolledSpacesField(String enrolledSpaces) {
		enrolledSpacesField.sendKeys(enrolledSpaces);
	}
	
	public void saveAndCLoseSDD() {
		wait.until(ExpectedConditions.visibilityOf(saveAndCloseButton)).click();
	}
}