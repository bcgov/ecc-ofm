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
	
	@FindBy(id = "mectrl_headerPicture")
	WebElement profileButton;
	
	@FindBy(xpath = "//*[@aria-label='Sign out of this account']")
	WebElement signOut;
	
	@FindBy(xpath = "//*[@aria-label='Organization-Facilities']")
	WebElement orgFacButton;
	
	@FindBy(xpath = "//*[@aria-label='Contacts']")
	WebElement contactButton;
	
	@FindBy(xpath = "//*[@aria-label='Licences']")
	WebElement licenseButton;
	
	@FindBy(xpath = "//*[@aria-label='Contact Lists']")
	WebElement contactListButton;
	
	@FindBy(xpath = "//*[@aria-label='Notifications']")
	WebElement notificationButton;
	
	@FindBy(xpath = "//*[@aria-label='Provider Reports']")
	WebElement providerReportsButton;
	
	@FindBy(xpath = "//*[@aria-label='Applications']")
	WebElement applicationsButton;
	
	@FindBy(xpath = "//*[@aria-label='Supplementaries']")
	WebElement supplementariesButton;
	
	@FindBy(xpath = "//*[@aria-label='Fundings']")
	WebElement fundingsButton;
	
	@FindBy(xpath = "//*[@aria-label='Assistance Requests']")
	WebElement assistanceRequestsButton;
	

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
	
	public void selectProfile() {
		wait.until(ExpectedConditions.elementToBeClickable(profileButton)).click();
	}
	
	public void clickSignOut() {
		wait.until(ExpectedConditions.elementToBeClickable(signOut)).click();
	}
	
	public void selectOrgFacButton() {
		wait.until(ExpectedConditions.elementToBeClickable(orgFacButton)).click();
	}
	
	public void selectContacts() {
		wait.until(ExpectedConditions.elementToBeClickable(contactButton)).click();
	}
	
	public void selectLicenses() {
		wait.until(ExpectedConditions.elementToBeClickable(licenseButton)).click();
	}
	
	public void selectContactList() {
		wait.until(ExpectedConditions.elementToBeClickable(contactListButton)).click();
	}
	
	public void selectNotifications() {
		wait.until(ExpectedConditions.elementToBeClickable(notificationButton)).click();
	}
	
	public void selectProviderReports() {
		wait.until(ExpectedConditions.elementToBeClickable(providerReportsButton)).click();
	}
	
	public void selectApplications() {
		wait.until(ExpectedConditions.elementToBeClickable(applicationsButton)).click();
	}
	
	public void selectSupplementaries() {
		wait.until(ExpectedConditions.elementToBeClickable(supplementariesButton)).click();
	}
	
	public void selectFundings() {
		wait.until(ExpectedConditions.elementToBeClickable(fundingsButton)).click();
	}
	
	public void selectAssistanceRequests() {
		wait.until(ExpectedConditions.elementToBeClickable(assistanceRequestsButton)).click();
	}
}
