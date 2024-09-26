package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal;

import java.time.Duration;
import java.util.Base64;
import java.util.List;
import java.util.NoSuchElementException;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PortalApplicationsEligibilityPage {
	WebDriver driver;
	WebDriverWait wait;
			
	@FindBy(id = "app-next-button")
	WebElement nextButton;
	
	public PortalApplicationsEligibilityPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}
	
	public void setEligibility() {
		WebElement yesOptionGreaterOneYearCCOFFTDAD = driver.findElements(By.xpath("//*[contains(@for, 'input-') and text()='Yes']")).get(0);
		wait.until(ExpectedConditions.elementToBeClickable(yesOptionGreaterOneYearCCOFFTDAD)).click();
		
		WebElement yesOptionMinistryGoodStanding = driver.findElements(By.xpath("//*[contains(@for, 'input-') and text()='Yes']")).get(1);
		wait.until(ExpectedConditions.elementToBeClickable(yesOptionMinistryGoodStanding)).click();
		
		WebElement yesOptionHealthAuthorityGoodStanding = driver.findElements(By.xpath("//*[contains(@for, 'input-') and text()='Yes']")).get(2);
		wait.until(ExpectedConditions.elementToBeClickable(yesOptionHealthAuthorityGoodStanding)).click();
		
		WebElement yesOptionCertificateGoodStanding = driver.findElements(By.xpath("//*[contains(@for, 'input-') and text()='Yes']")).get(3);
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", yesOptionHealthAuthorityGoodStanding);
		 wait.until(ExpectedConditions.elementToBeClickable(yesOptionCertificateGoodStanding)).click();
		
		WebElement yesOptionECEWEParticipation = driver.findElements(By.xpath("//*[contains(@for, 'input-') and text()='Yes']")).get(4);
		wait.until(ExpectedConditions.elementToBeClickable(yesOptionECEWEParticipation)).click();
		
		WebElement yesOptionACCBParticipation = driver.findElements(By.xpath("//*[contains(@for, 'input-') and text()='Yes']")).get(5);
		wait.until(ExpectedConditions.elementToBeClickable(yesOptionACCBParticipation)).click();
		
		WebElement yesOptionActualExpenses = driver.findElements(By.xpath("//*[contains(@for, 'input-') and text()='Yes']")).get(6);
		wait.until(ExpectedConditions.elementToBeClickable(yesOptionActualExpenses)).click();
		
		WebElement yesOptionFinancialStatements = driver.findElements(By.xpath("//*[contains(@for, 'input-') and text()='Yes']")).get(7);
		wait.until(ExpectedConditions.elementToBeClickable(yesOptionFinancialStatements)).click();
		
		WebElement yesOptionInsuranceCoverage = driver.findElements(By.xpath("//*[contains(@for, 'input-') and text()='Yes']")).get(8);
		wait.until(ExpectedConditions.elementToBeClickable(yesOptionInsuranceCoverage)).click();
		
		WebElement yesOptionEconomicParticipation = driver.findElements(By.xpath("//*[contains(@for, 'input-') and text()='Yes']")).get(9);
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", yesOptionInsuranceCoverage);
		wait.until(ExpectedConditions.elementToBeClickable(yesOptionEconomicParticipation)).click();
		
		WebElement yesOptionSeperateBankAccount = driver.findElements(By.xpath("//*[contains(@for, 'input-') and text()='Yes']")).get(10);
		wait.until(ExpectedConditions.elementToBeClickable(yesOptionSeperateBankAccount)).click();
	}
	
	public void clickNext() {
		wait.until(ExpectedConditions.elementToBeClickable(nextButton)).click();
	}
	
}