/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

/**
 *
 */
package gov.nih.nci.nbia;

import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

//import javax.servlet.http.HttpServletResponse;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JTextField;
import javax.swing.border.EmptyBorder;

import gov.nih.nci.nbia.util.StringEncrypter;
import org.apache.commons.lang.math.NumberUtils;

/**
 * @author Q. Pan
 *
 */
public abstract class StandaloneDM {
	protected final String winTitle = "TCIA Downloader";
	protected static final String SubmitBtnLbl = "Submit";	
	protected JFrame frame;
	protected JLabel statusLbl;
	protected JTextField userNameFld;
	protected JPasswordField passwdFld;
	protected String serverUrl;
	protected boolean includeAnnotation;
	protected Integer noOfRetry;
	protected String userId = null;
	protected String password = null;

	public StandaloneDM() {
		this.userId = null;
		this.password = null;
		this.serverUrl = System.getProperty("downloadServerUrl");
		this.includeAnnotation = Boolean.valueOf((System.getProperty("includeAnnotation")));
		this.noOfRetry = NumberUtils.toInt(System.getProperty("noOfrRetry"));
	}

	abstract void checkCompatibility();

	public void constructLoginWin() {
		frame = new JFrame("Standalone Download Manager");
		frame.setBounds(100, 100, 640, 320);
		frame.setContentPane(constructLoginPanel());// frame.setSize(800,
													// 480);
		frame.setTitle(winTitle);
		frame.setVisible(true);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	}

	private JPanel constructLoginPanel() {
		JPanel contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		contentPane.setLayout(null);

		JLabel lblNewLabel_2 = new JLabel();
		lblNewLabel_2.setBounds(20, 11, 100, 100);
		contentPane.add(lblNewLabel_2);
		ImageIcon iconLogo = new ImageIcon("Images/global.logo");
		lblNewLabel_2.setIcon(iconLogo);
		statusLbl = new JLabel(
				"<html>Some or all of the images you are about to download are from<br>private collection(s). Please log in first.</html>");
		contentPane.add(statusLbl);
		statusLbl.setBounds(110, 11, 500, 42);
		JLabel lblNewLabel = new JLabel("User Name");
		contentPane.add(lblNewLabel);
		lblNewLabel.setBounds(110, 79, 77, 31);

		userNameFld = new JTextField();
		contentPane.add(userNameFld);
		userNameFld.setBounds(187, 75, 333, 36);
		userNameFld.setColumns(10);

		JButton submitBtn = new JButton(SubmitBtnLbl);
		submitBtn.addActionListener(new BtnListener());
		contentPane.add(submitBtn);
		submitBtn.setBounds(249, 200, 139, 36);

		passwdFld = new JPasswordField();
		contentPane.add(passwdFld);
		passwdFld.setBounds(187, 129, 333, 36);

		userNameFld.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				passwdFld.requestFocus();
			}
		});

		passwdFld.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				userId = userNameFld.getText();
				password = passwdFld.getText();
				if ((userId.length() < 1) || (password.length() < 1)) {
					statusLbl.setText("Please enter a valid user name and password.");
					statusLbl.setForeground(Color.red);
				} else
					submitUserCredential(userId, password);
			}
		});

		JLabel lblNewLabel_1 = new JLabel("Password");
		contentPane.add(lblNewLabel_1);
		lblNewLabel_1.setBounds(110, 129, 77, 36);

		return contentPane;
	}

//	abstract void launch();

	abstract void submitUserCredential(String userId, String password);

	protected String encrypt(String password, String key) throws Exception {
		StringEncrypter encrypter = new StringEncrypter();
		return encrypter.encryptString(password, key);
	}

	protected boolean loggedIn(String uid, String pwd, String ruid, String rpwd) {
		if (uid.equals(ruid) && pwd.equals(rpwd)) {
			return true;
		} else
			return false;
	}

	private class BtnListener implements ActionListener {
		@Override
		public void actionPerformed(ActionEvent e) {
			if (e.getActionCommand().equals(SubmitBtnLbl)) {
				userId = userNameFld.getText();
				password = passwdFld.getText();
				if ((userId.length() < 1) || (password.length() < 1)) {
					statusLbl.setText("Please enter a valid user name and password.");
					statusLbl.setForeground(Color.red);
				} else
					submitUserCredential(userId, password);
			}
		}
	}
}
