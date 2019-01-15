/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.ui;

import java.awt.FileDialog;
import java.awt.Frame;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.SwingUtilities;
import javax.swing.filechooser.FileNameExtensionFilter;

import gov.nih.nci.nbia.Application;
import gov.nih.nci.nbia.download.AbstractSeriesDownloader;
import gov.nih.nci.nbia.download.LocalSeriesDownloader;
import gov.nih.nci.nbia.util.ThreadPool;
import gov.nih.nci.nbia.util.ThreadPoolListener;

/**
 * @author lethai
 *
 */
public class ButtonUpdater implements ThreadPoolListener {

	/*
	 * (non-Javadoc)
	 * 
	 * @see gov.nih.nci.nbia.util.ThreadPoolListener#update()
	 */
	private JButton pauseButton, resumeButton;
	private JLabel errorLabel; // lrt - added errorLabel
	private JTable table = null;
	private boolean retry = false;
	private PropertyChangeListener propertyChangeListener = new PropertyChangeListener() {
		public void propertyChange(PropertyChangeEvent evt) {
			if ("status".equals(evt.getPropertyName())) {
				int status = Integer.parseInt(evt.getNewValue().toString());
				if (AbstractSeriesDownloader.ERROR == status && !errorLabel.isVisible()) {
					errorLabel.setVisible(true);
				}
			}
		}
	};

	public ButtonUpdater(JButton pauseButton, JButton resumeButton, JLabel errorLabel) {
		this.pauseButton = pauseButton;
		this.resumeButton = resumeButton;
		// lrt added errorLabel to record final status
		this.errorLabel = errorLabel;
	}

	public ButtonUpdater(JButton pauseButton, JButton resumeButton, JLabel errorLabel, JTable table) {
		this.pauseButton = pauseButton;
		this.resumeButton = resumeButton;
		// lrt added errorLabel to record final status
		this.errorLabel = errorLabel;
		this.table = table;
	}

	public void update() {
		// TODO Auto-generated method stub
		// disable pause/resume buttons
		this.pauseButton.setEnabled(false);
		this.resumeButton.setEnabled(false);
		if (!errorLabel.isVisible()) {
			this.errorLabel.setText("Downloads Complete"); // lrt - let user know that we are done with all downloads
															// and retries
		} else {
			String errLabletext = this.errorLabel.getText();
			this.errorLabel.setText(errLabletext + " Please contact support for failed series. Downloads Complete");
			optionsForErrCondiction();
		}
		if (!retry)
			this.errorLabel.setVisible(true);
	}

	private String getCSVNameFromUser() {
		String defaultFileName = "downloadErrRpt.csv";
		String userDir = System.getProperty("user.home");
		String os = System.getProperty("os.name").toLowerCase();
		String path = null;//userDir + File.separator + "Desktop" + File.separator + defaultFileName;
		if (os.startsWith("mac")) {
			path = getFilePathOnMac(defaultFileName);
		}
		else {
			JFileChooser chooser;
			chooser = new JFileChooser();
			chooser.setDialogTitle("Select Directory and File Name");
			chooser.setFileSelectionMode(JFileChooser.FILES_AND_DIRECTORIES);
			chooser.setSelectedFile(new File(userDir + File.separator + "Desktop" + File.separator + defaultFileName));
			chooser.setFileFilter(new FileNameExtensionFilter("csv", "csv"));

			/* disable the "All files" option. */
			chooser.setAcceptAllFileFilterUsed(false);
			chooser.showSaveDialog(table);
			path = chooser.getSelectedFile().getAbsolutePath();
			File f = new File(path);

			if (f.isDirectory()) {
				path = path + File.separator + defaultFileName;
			}

			if (!path.endsWith(".csv"))
				path += ".csv";
		}
		return path;
	}
	
	private String getFilePathOnMac(String defaultFileName) {
		FileDialog fileDialog= new FileDialog(new Frame(), "Select Directory and File Name", FileDialog.SAVE);
		fileDialog.setFile(defaultFileName);
		fileDialog.setVisible(true);
		
		String selectedDir = fileDialog.getDirectory();
		String name = fileDialog.getFile();

	    if( selectedDir != null && name!= null ) {
	    		File dir= new File(selectedDir);
	    		if (!dir.canWrite()) {
	    			JOptionPane.showMessageDialog(null,
	    					"The directory you selected " + selectedDir + " is not writable.  Please select another one.");
	    			return getFilePathOnMac(defaultFileName);
	    		}
	    		else {
	    			return (selectedDir + name);
	    		}
	    }
	    else return null;
	}
	

	private void optionsForErrCondiction() {
		if (table != null) {
			Object[] options = { "Retry failed series", "Save error report", "Exit" };

			int n = JOptionPane.showOptionDialog(table, "  Download completed with one or more errors detected.\n\n\n", "Error Handling Options",
					JOptionPane.OK_OPTION, JOptionPane.PLAIN_MESSAGE, null, options, options[0]);

			if (n == 2) {
				System.exit(1);
			} else if (n == 1) {
				retry = false;
				String csvName = getCSVNameFromUser();
				writeErrRpt(csvName, table);
			} else if (n == 0) {
				retry = true;
				resetAndRetry();
			}
		}
	}

	private void writeErrRpt(String filename, JTable table) {
		try {
			FileWriter csvwriter = new FileWriter(filename);
			int j;
			for (j = 0; j < table.getColumnCount() - 1; ++j) {
				csvwriter.append(table.getColumnName(j) + ",");
			}
			csvwriter.append(table.getColumnName(j));
			csvwriter.append("\n");
			for (int i = 0; i < table.getRowCount(); ++i) {
				if (!((table.getValueAt(i, DownloadsTableModel.STATUS_COLUMN).equals("Complete")))) {
					for (j = 0; j < table.getColumnCount() - 1; ++j) {
						csvwriter.append(table.getValueAt(i, j) + ",");
					}
					csvwriter.append(table.getValueAt(i, j).toString());
					csvwriter.append("\n");
				}
			}

			csvwriter.close();
		} catch (Exception e) {
			System.out.println("exception :" + e.getMessage());
		}
	}

	private void resetAndRetry() {
		errorLabel.setVisible(false);
		errorLabel.setText("");
		pauseButton.setEnabled(true);
		resumeButton.setEnabled(false);

		List<AbstractSeriesDownloader> removeList = new ArrayList<AbstractSeriesDownloader>();
		for (int i = 0; i < table.getRowCount(); ++i) {
			if (table.getValueAt(i, DownloadsTableModel.STATUS_COLUMN).equals("Complete")) {
				removeList.add(((DownloadsTableModel) (table.getModel())).getDownload(i));
			}
		}
		((DownloadsTableModel) (table.getModel())).getDownloadList().removeAll(removeList);
		((DownloadsTableModel) (table.getModel())).fireTableDataChanged();

		for (int j = 0; j < table.getRowCount(); ++j) {
			if (!((table.getValueAt(j, DownloadsTableModel.STATUS_COLUMN).equals("Complete")))) {
				((LocalSeriesDownloader) ((DownloadsTableModel) (table.getModel())).getDownload(j))
						.resetDownloadProgress();
			}
		}
		SwingUtilities.invokeLater(new Runnable() {
			public void run() {

				ThreadPool pool = new ThreadPool(Application.getNumberOfMaxThreads());
				int size = table.getRowCount();
				for (int i = 0; i < size; i++) {
					LocalSeriesDownloader dl = (LocalSeriesDownloader) ((DownloadsTableModel) table.getModel())
							.getDownload(i);
					pool.assign(dl);
					dl.addPropertyChangeListener(propertyChangeListener);
				}
				pool.addThreadPoolListener(new ButtonUpdater(pauseButton, resumeButton, errorLabel, table));
			}
		});
	}
}