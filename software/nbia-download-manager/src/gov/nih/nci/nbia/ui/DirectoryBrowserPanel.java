/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.ui;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.FileDialog;

import java.awt.Frame;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.io.File;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.event.DocumentListener;
import javax.swing.event.DocumentEvent;

public class DirectoryBrowserPanel extends JPanel {
	public DirectoryBrowserPanel() {
		JLabel fileLocation = new JLabel("Select Directory For Downloaded Files:");
		//browseTextField = new JTextField(35);
		browseTextField = new HintTextField("Click on Browse button on the right to select a directory.");
		JButton browseButton = new JButton("Browse");

		add(fileLocation);
		add(browseTextField);
		add(browseButton);

		//browseTextField.setText(System.getProperty("java.io.tmpdir"));
		//browseTextField.setText("");
		browseButton.requestFocus();
		browseButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				actionBrowse();
			}
		});
		browseTextField.getDocument().addDocumentListener(new DocumentListener() {
			public void insertUpdate(DocumentEvent e){
				DownloadManagerFrame.startButton.setEnabled(true);
			}
		    public void changedUpdate(DocumentEvent e) {
		        
		    }
		    
		    public void removeUpdate(DocumentEvent e) {
		        
		    }
		});
	}
	

	public String getDirectory() {
		return browseTextField.getText();
	}
	
	public void setDefaultDirectory(String defaultDir) {
		browseTextField.setText(defaultDir);
	}
	
	public boolean isDirWritable(String path) {
		File dir= new File(path);
		if (!dir.canWrite()) {
			JOptionPane.showMessageDialog(null,
					"The download directory is not writable.  Please select another one.");
			return false;
		}
		else return true;
	}

	//////////////////////////////////PRIVATE///////////////////////////
	/* Add download text field. */
	private JTextField browseTextField;


	private void actionBrowse() {
		String os = System.getProperty("os.name").toLowerCase();
		if (os.startsWith("mac")) {
			
			System.setProperty("apple.awt.fileDialogForDirectories", "true");
			FileDialog fileDialog= new FileDialog(new Frame(), "Select Directory", FileDialog.LOAD);
			fileDialog.setDirectory(browseTextField.getText());
			fileDialog.setVisible(true);
			
			String path = fileDialog.getDirectory();
			String name = fileDialog.getFile();
			String selectedDir = path + name;

		    if( path != null && fileDialog.getFile() != null ) {
		    		File dir= new File(selectedDir);
		    		if (!dir.canWrite()) {
		    			JOptionPane.showMessageDialog(null,
		    					"The directory you selected " + selectedDir + " is not writable.  Please select another one.");
		    		}
		    		else {
		    			browseTextField.setText(selectedDir);
		    		}
		    }
		    else System.out.println("No Selection");
		}
		else {

			JFileChooser chooser;
			chooser = new JFileChooser();
			chooser.setCurrentDirectory(new java.io.File(getDirectory()));
			chooser.setDialogTitle("Select Directory");
			chooser.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);

			/* disable the "All files" option. */
			chooser.setAcceptAllFileFilterUsed(false);
			//
			if (chooser.showOpenDialog(this) == JFileChooser.APPROVE_OPTION) {

				browseTextField.setText(chooser.getSelectedFile().getPath());

			} else {
				System.out.println("No Selection ");
			}
		}
        
        if (browseTextField.getText().trim().length() >= 3) {  //e.g  C:/
        	if (DownloadManagerFrame.errorLabel.isVisible() == false)
        	  DownloadManagerFrame.startButton.setEnabled(true);
        }
        else {
        	
        	DownloadManagerFrame.startButton.setEnabled(false);
        	JOptionPane.showMessageDialog(this, "Please select a valid direcory to put the files...", "Destination-Directory", JOptionPane.WARNING_MESSAGE);
        }
        	
	}
}

class HintTextField extends JTextField implements FocusListener {

	  private final String hint;
	  private boolean showingHint;

	  public HintTextField(final String hint) {
	    super(hint);
	    this.hint = hint;
	    this.showingHint = true;
	    this.setPreferredSize(new Dimension(400, 30));
	    this.setBorder(BorderFactory.createEmptyBorder(0, 5, 0, 0));
	    this.setForeground(Color.LIGHT_GRAY);
	    super.addFocusListener(this);
	  }
	  
	  public void setHint(String txt) {
		  showingHint = true;
		  this.setForeground(Color.LIGHT_GRAY);
		  super.setText(txt);
	  }
	  
	  public void setText(String txt) {
		  showingHint = false;
		  this.setForeground(Color.BLACK);
		  super.setText(txt);
	  }

	  @Override
	  public void focusGained(FocusEvent e) {
	    if(this.getText().isEmpty()) {
	      super.setText("");
	      this.setForeground(Color.BLACK);
	      showingHint = false;
	    }
	  }
	  @Override
	  public void focusLost(FocusEvent e) {
	    if(this.getText().isEmpty()) {
	      super.setText(hint);
	      this.setForeground(Color.LIGHT_GRAY);
	      showingHint = true;
	    }  	    
	  }

	  @Override
	  public String getText() {
	    return showingHint ? "" : super.getText();
	  }
	}
