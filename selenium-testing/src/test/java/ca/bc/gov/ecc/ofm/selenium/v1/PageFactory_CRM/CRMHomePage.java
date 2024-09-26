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

public class CRMHomePage {
	WebDriver driver;
	WebDriverWait wait;

	@FindBy(xpath = "//*[@aria-label='New']")
	WebElement newOrganizationButton;
	
	@FindBy(xpath = "//*[@aria-label='Irregular Expense Test Subject']")
	WebElement assistanceRequestButton;
	
	@FindBy(xpath = "//*[@aria-label='Edit']")
	WebElement editButton;

	public CRMHomePage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public void pressNewOrganization() {
		wait.until(ExpectedConditions.elementToBeClickable(newOrganizationButton)).click();
	}
	
	public void selectIrregularExpenseApplication() {
		try {
			wait.until(ExpectedConditions.elementToBeClickable(assistanceRequestButton)).click();
			wait.until(ExpectedConditions.elementToBeClickable(editButton)).click();
		}
		catch(Exception e) {
			e.printStackTrace();
		}
	}
}
