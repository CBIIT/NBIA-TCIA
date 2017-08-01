/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.ui;

import java.awt.BorderLayout;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;

import javax.swing.BorderFactory;
import javax.swing.ButtonGroup;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JRadioButton;


public class RadioButtonPanel extends JPanel implements ActionListener{

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	static String classicString = "Classic Directory Name";
    static String descString = "Descriptive Directory Name";
	private boolean classicDirSet = false;
 
    public RadioButtonPanel() {
        super(new BorderLayout());
        JLabel dirType = new JLabel("Select Directory Type For Downloaded Files:");
        //Create the radio buttons.
        JRadioButton classicButton = new JRadioButton(classicString);
        classicButton.setMnemonic(KeyEvent.VK_C);
        classicButton.setActionCommand(classicString);
        

        JRadioButton descButton = new JRadioButton(descString);
        descButton.setMnemonic(KeyEvent.VK_D);
        descButton.setActionCommand(descString);
        descButton.setSelected(true);        
 
        //Group the radio buttons.
        ButtonGroup group = new ButtonGroup();
        group.add(descButton);
        group.add(classicButton);
 
        //Register a listener for the radio buttons.
        classicButton.addActionListener(this);
        descButton.addActionListener(this);
  
        //Put the radio buttons in a column in a panel.
        JPanel radioPanel = new JPanel(new GridLayout(1, 3));
        radioPanel.add(dirType);        
        radioPanel.add(descButton);
        radioPanel.add(classicButton);
 
        add(radioPanel, BorderLayout.LINE_START);
        setBorder(BorderFactory.createEmptyBorder(0,20,0,0));
    }
 
    /** Listens to the radio buttons. */
    public void actionPerformed(ActionEvent e) {
		if (e.getActionCommand().equals(descString))
			classicDirSet = false;
		else classicDirSet = true;
    }
	
	public boolean isClassicDir(){
		return classicDirSet;
	}
}
