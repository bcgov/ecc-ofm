package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindAll;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.Wait;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PortalApplicationsStaffing {
	private WebDriver driver;
	WebDriverWait wait;

	@FindBy(xpath = "//*[@name = 'is-unionized' and @value = '0']")
	private WebElement unionizedNo;

	@FindBy(id = "app-next-button")
	@CacheLookup
	private WebElement next;

	public PortalApplicationsStaffing(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofSeconds(20));
	}

	public void setITEFullTime(String count) {
		WebElement iteFullTime = driver.findElements(By.xpath("//*[contains(@id, 'input') and @type = 'text']")).get(0);
		iteFullTime.sendKeys(Keys.CONTROL + "a");
		iteFullTime.sendKeys(count);
		
		WebElement initials = driver.findElements(By.xpath("//*[contains(@id, 'input') and @type = 'text']")).get(2);
		wait.until(ExpectedConditions.elementToBeClickable(initials));
		initials.sendKeys(Keys.CONTROL + "a");
		initials.sendKeys("ab");

		WebElement eceCertNumber = driver.findElements(By.xpath("//*[contains(@id, 'input') and @type = 'text']"))
				.get(3);
		eceCertNumber.sendKeys(Keys.CONTROL + "a");
		eceCertNumber.sendKeys("12345");

	}
	

	public void setUnionizedNo() {
		if (!unionizedNo.isSelected()) {
			unionizedNo.click();
		}

	}

	public void clickNextButton() {
		wait.until(ExpectedConditions.elementToBeClickable(next));
		wait.until(ExpectedConditions.visibilityOf(next));
		next.click();
	}

}
