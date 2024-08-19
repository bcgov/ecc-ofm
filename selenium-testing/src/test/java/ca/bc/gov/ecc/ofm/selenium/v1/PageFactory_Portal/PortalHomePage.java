package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class PortalHomePage {
	WebDriver driver;

//	@FindBy(xpath = "//*[@id=\'app\']/div/main/div[3]/div[2]/div[3]/div/div[3]")
	
	@FindBy(id = "applications-card")
	WebElement box_Applications;

	public PortalHomePage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}

	public void clickOnApplicationBox() {
		box_Applications.click();
	}
}
