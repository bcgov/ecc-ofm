package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PortalHomePage {
	WebDriver driver;
	WebDriverWait wait;
	
	@FindBy(id = "applications-card")
	WebElement box_Applications;
	
	@FindBy(xpath = "//*[contains(text(), '" + "Log Out" + "')]")
	WebElement logout;

	public PortalHomePage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public void clickOnApplicationBox() {
		box_Applications.click();
	}
	
	public void clickOnUsername(String username) throws Exception {
		String usernameLowerCase = username.toLowerCase();
        String xpathExpression = "//*[translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = '" + usernameLowerCase + "']";
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(xpathExpression)));
        Thread.sleep(2000);
        driver.findElement(By.xpath(xpathExpression)).click();
	}
	
	public void logout() {
		wait.until(ExpectedConditions.elementToBeClickable(logout));
		logout.click();			
	}
}
