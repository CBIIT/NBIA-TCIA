/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.ui;

import gov.nih.nci.nbia.util.BrowserLauncher;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;

import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JOptionPane;

public class MenuBar extends JMenuBar{	

	public MenuBar() {
		JMenu fileMenu = new JMenu("File");
        fileMenu.setMnemonic(KeyEvent.VK_F);
        JMenuItem fileExitMenuItem = new JMenuItem("Exit",
                KeyEvent.VK_X);
        fileExitMenuItem.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                actionExit();
            }
        });
        fileMenu.add(fileExitMenuItem);
		JMenu helpMenu = new JMenu("Help");
		fileMenu.setMnemonic(KeyEvent.VK_H);
		JMenuItem helpMenuItem = new JMenuItem("Online Help",
                KeyEvent.VK_O);
        helpMenuItem.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                BrowserLauncher.openUrl();
            }
        });
        helpMenu.add(helpMenuItem);      
        
		add(fileMenu);
		add(helpMenu);
	}
	
	public MenuBar(String version, String helpDeskUrl) {
		JMenu fileMenu = new JMenu("File");
        fileMenu.setMnemonic(KeyEvent.VK_F);
        JMenuItem fileExitMenuItem = new JMenuItem("Exit",
                KeyEvent.VK_X);
        fileExitMenuItem.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                actionExit();
            }
        });
        fileMenu.add(fileExitMenuItem);
		JMenu helpMenu = new JMenu("Help");
		fileMenu.setMnemonic(KeyEvent.VK_H);
		JMenuItem helpMenuItem = new JMenuItem("Online Help",
                KeyEvent.VK_O);
        helpMenuItem.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                BrowserLauncher.openUrl();
            }
        });
        helpMenu.add(helpMenuItem); 
        
        JMenuItem helpdeskInfoMenuItem =  new JMenuItem("Help Desk Info",
        		KeyEvent.VK_I);
        helpdeskInfoMenuItem.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                BrowserLauncher.openUrlForHelpDesk();
            }
        });
        helpMenu.add(helpdeskInfoMenuItem);
        
        JMenuItem aboutMenuItem =  new JMenuItem("About",
        		KeyEvent.VK_A);
        aboutMenuItem.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
            	JOptionPane.showOptionDialog(null, "Version: " +version, 
            			"About", JOptionPane.DEFAULT_OPTION,JOptionPane.INFORMATION_MESSAGE, null, new Object[]{}, null);
            }
        });
        helpMenu.add(aboutMenuItem);        
        
		add(fileMenu);
		add(helpMenu);
	}	
	
	private void actionExit() {
        System.exit(0);
    }
}
