package gov.nih.nci.nbia.ui;

import java.awt.BorderLayout;
import java.awt.Color;
import java.util.Observable;
import java.util.Observer;

import javax.swing.JPanel;
import javax.swing.JProgressBar;
import javax.swing.SwingUtilities;
import javax.swing.border.Border;
import javax.swing.border.EmptyBorder;
import javax.swing.border.TitledBorder;

import gov.nih.nci.nbia.download.LocalSeriesDownloader;

public class TotalProgressPanel extends JPanel implements Observer {
	long totalSize;
	JProgressBar progressBar;
	long subTotal = 0;

	public TotalProgressPanel() {
		super();
		Border margin = new EmptyBorder(30, 20, 20, 20);
		setBorder(new TitledBorder(
				new TitledBorder(margin, "", TitledBorder.LEADING, TitledBorder.TOP, null, new Color(0, 0, 0)),
				"Overall Progress ", TitledBorder.LEADING, TitledBorder.TOP, null, null));
		setLayout(new BorderLayout(30, 30));
		progressBar = new JProgressBar();
		progressBar.setValue(0);
		progressBar.setStringPainted(true);
		add(progressBar, BorderLayout.CENTER);
		setVisible(false);
	}

	public void setTotalSize(long totalSize) {
		this.totalSize = totalSize;
	}

	@Override
	public void update(Observable o, Object arg) {
		LocalSeriesDownloader downloader = (LocalSeriesDownloader) o;
		if (downloader.getStatus() == downloader.COMPLETE) {
			subTotal = subTotal + downloader.getSize();
			System.out.println("@@@@@sid =" + downloader.getSeriesInstanceUid() + " size = " + downloader.getSize()
					+ " subtotal now = " + subTotal + " totalSize =" + totalSize);
			double progress = ((double) subTotal / totalSize) * 100;
			SwingUtilities.invokeLater(new Runnable() {
				public void run() {
					progressBar.setValue((int) progress);
				}
			});

		}
	}

	public void actionStarted() {
		setVisible(true);
	}
}
