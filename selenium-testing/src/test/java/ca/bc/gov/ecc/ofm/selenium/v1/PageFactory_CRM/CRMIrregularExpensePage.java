package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_CRM;

import java.time.Duration;
import java.util.Base64;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class CRMIrregularExpensePage {
	WebDriver driver;
	WebDriverWait wait;

	@FindBy(xpath = "//*[@aria-label='Related']")
	WebElement relatedButton;
	
	@FindBy(xpath = "//*[@aria-label='Expense Applications']")
	WebElement expenseApplication;

	public CRMIrregularExpensePage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}
	
	public void selectExpenseApplications() {
		wait.until(ExpectedConditions.elementToBeClickable(relatedButton)).click();
		wait.until(ExpectedConditions.elementToBeClickable(expenseApplication)).click();
	}
}