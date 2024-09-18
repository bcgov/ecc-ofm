package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM;

import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class CRMNewIrregularExpenseApplicationPage {
	WebDriver driver;
	WebDriverWait wait;
	LocalDate currentDate = LocalDate.now();
	
	// Variables needed to calculate start date and end date
	int currentDay = currentDate.getDayOfMonth();
	int currentYear = currentDate.getYear();
	int lastDayOfMonth = currentDate.withDayOfMonth(1).plusMonths(1).minusDays(1).getDayOfMonth();
	String currentMonth = currentDate.format(DateTimeFormatter.ofPattern("MMMM")).toString();
	String nextMonth = currentDate.plusMonths(1).format(DateTimeFormatter.ofPattern("MMMM")).toString();

	@FindBy(xpath = "//button[@aria-label='New Expense Application. Add New Expense Application']")
	WebElement addIrregularExpense;
	
	@FindBy(xpath = "//*[contains(@id, 'confirmButton')]")
	WebElement saveAndClose;
	
	@FindBy(xpath = "//input[@type='text' and @aria-label='Application, Lookup']")
	WebElement applicationField;
	
	@FindBy(xpath = "//input[@type='text' and @aria-label='Funding Amount']")
	WebElement fundingAmountField;
	
	@FindBy(xpath = "//button[@aria-label='Payment Frequency']")
	WebElement paymentFrequencyButton;
	
	@FindBy(xpath = "//div[text()='Lump Sum']")
	WebElement paymentFrequencyOption;
	
	@FindBy(xpath = "//*[@aria-label='Date of Start Date']")
	WebElement startDateField;
	
	@FindBy(xpath = "//*[@aria-label='Date of End Date']")
	WebElement endDateField;
	
	@FindBy(xpath = "//*[contains(@title, 'Navigate to next month')]")
	WebElement datePickerNextArrow;
	
	@FindBy(xpath = "//*[@aria-label='Rich Text Editor Control ofm_expense ofm_request_summary']")
	WebElement requestSummaryField;
	
	public CRMNewIrregularExpenseApplicationPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public void addIrregularExpense() throws Exception {
		try {
			wait.until(ExpectedConditions.elementToBeClickable(addIrregularExpense)).click();
			wait.until(ExpectedConditions.elementToBeClickable(saveAndClose)).click();
		}
		catch(Exception e) {
			System.out.println("There is no save required on this expense application");
		}
	}
	
	public void enterApplication(String applicationNumber) throws Exception {
		wait.until(ExpectedConditions.elementToBeClickable(applicationField)).click();
		try {
			if(applicationNumber.isEmpty()) {
				throw new Exception("Add your application number in the applicationField variable");
			}
			applicationField.sendKeys(applicationNumber);
			String findApplicationByXpathString = String.format("//*[contains(@aria-label, '%s')]", applicationNumber);
			System.out.println(findApplicationByXpathString);
			wait.until(ExpectedConditions.elementToBeClickable(By.xpath(findApplicationByXpathString))).click();
		}
		catch(Exception e) {
			System.out.println(e.getMessage());
		}	
	}
	
	public void enterFundingAmount(String fundingAmount) throws Exception { 
		fundingAmountField.sendKeys(fundingAmount);
	}
	
	public void enterPaymentFrequency() throws Exception {
		wait.until(ExpectedConditions.elementToBeClickable(paymentFrequencyButton)).click();
		wait.until(ExpectedConditions.elementToBeClickable(paymentFrequencyOption)).click();
	}
	
	public void enterStartDate() throws Exception {
		wait.until(ExpectedConditions.elementToBeClickable(startDateField)).click();
		
		// If the current day is the last day of the month, it will set the date to the first of the next month
		if (currentDay == lastDayOfMonth) {
			wait.until(ExpectedConditions.elementToBeClickable(datePickerNextArrow)).click();
			findByXpathSetDateFields(1, nextMonth, currentYear);
		}
		else {
			// Sets the date to the day after the current date
			findByXpathSetDateFields(currentDay + 1, currentMonth, currentYear);
		}
	}
	
	public void enterEndDate() throws Exception {
		wait.until(ExpectedConditions.elementToBeClickable(endDateField)).click();
		
		// If the start date is the last day of the month, it will set the end date to the last day of the next month
		if (currentDay + 1 == lastDayOfMonth) {
			wait.until(ExpectedConditions.elementToBeClickable(datePickerNextArrow)).click();
			findByXpathSetDateFields(lastDayOfMonth, nextMonth, currentYear);
		}
		else {
			// Sets the end date to the last day of the current month
			findByXpathSetDateFields(lastDayOfMonth, currentMonth, currentYear);
		}
	}
	
	public void findByXpathSetDateFields(int day, String month, int year) {
		String findByXpathString = String.format("//*[contains(@aria-label, '%d, %s, %d')]", day, month, year);
		wait.until(ExpectedConditions.elementToBeClickable(By.xpath(findByXpathString))).click();
	}
	
	public void enterRequestSummary(String requestSummary) throws Exception {
		requestSummaryField.sendKeys(requestSummary);
	}
}
