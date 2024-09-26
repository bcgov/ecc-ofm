package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM;

import java.time.Duration;

import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class CRMIrregularExpenseVerificationPage {
	WebDriver driver;
	WebDriverWait wait;
	
	@FindBy(xpath = "//*[@aria-label='Verification & Notes']")
	WebElement verificationTab;

	@FindBy(xpath = "//*[@aria-label='Purpose of expense supported by policy']")
	WebElement purposeOfExpenseSupportedByPolicyVerificationField;

	@FindBy(xpath = "//*[@aria-label='Quotations for work confirmed']")
	WebElement quotationsForWorkConfirmedVerificationField;

	@FindBy(xpath = "//*[@aria-label='Quotations are arm’s length']")
	WebElement quotationsAreArmsLengthVerificationField;

	@FindBy(xpath = "//*[@aria-label='Supporting documents complete']")
	WebElement supportingDocumentsCompleteVerificationField;

	@FindBy(xpath = "//*[@aria-label='All avenues for funding exhausted']")
	WebElement allAvenuesForFundingExhaustedVerificationField;
	
	@FindBy(xpath = "//div[text()='Complete']")
	WebElement completeVerificationStatus;

	@FindBy(xpath = "//*[@aria-label='Save (CTRL+S)']")
	WebElement saveButton;

	@FindBy(xpath = "//*[@aria-label='More Header Editable Fields']")
	WebElement arrowDropdownButton;

	@FindBy(xpath = "//*[@aria-label='Status Reason']")
	WebElement statusReasonButton;
	
	@FindBy(xpath = "//div[text()='Recommended for Approval']")
	WebElement recommendedForApproval;
	
	public CRMIrregularExpenseVerificationPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}
	
	public void selectVerificationTab() throws Exception {
		wait.until(ExpectedConditions.elementToBeClickable(verificationTab)).click();
	}
	
	public void setVerifyFields() throws Exception {
		wait.until(ExpectedConditions.elementToBeClickable(purposeOfExpenseSupportedByPolicyVerificationField)).click();
		wait.until(ExpectedConditions.elementToBeClickable(completeVerificationStatus)).click();
		
		wait.until(ExpectedConditions.elementToBeClickable(quotationsForWorkConfirmedVerificationField)).click();
		wait.until(ExpectedConditions.elementToBeClickable(completeVerificationStatus)).click();
		
		wait.until(ExpectedConditions.elementToBeClickable(quotationsAreArmsLengthVerificationField)).click();
		wait.until(ExpectedConditions.elementToBeClickable(completeVerificationStatus)).click();
		
		wait.until(ExpectedConditions.elementToBeClickable(supportingDocumentsCompleteVerificationField)).click();
		wait.until(ExpectedConditions.elementToBeClickable(completeVerificationStatus)).click();
		
		wait.until(ExpectedConditions.elementToBeClickable(allAvenuesForFundingExhaustedVerificationField)).click();
		wait.until(ExpectedConditions.elementToBeClickable(completeVerificationStatus)).click();
	}
	
	public void saveIrregularExpenseApplication() throws Exception {
		wait.until(ExpectedConditions.elementToBeClickable(saveButton)).click();
	}
	
	public void setStatusRecommendedForApproval() {
		wait.until(ExpectedConditions.elementToBeClickable(arrowDropdownButton)).click();
		wait.until(ExpectedConditions.elementToBeClickable(statusReasonButton)).click();
		wait.until(ExpectedConditions.elementToBeClickable(recommendedForApproval)).click();
	}
}
