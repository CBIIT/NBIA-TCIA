package gov.nih.nci.nbia;

import javax.swing.JEditorPane;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import com.apple.eawt.AppEvent;
import com.apple.eawt.Application;

import gov.nih.nci.nbia.util.BrowserLauncher;

import java.awt.Font;
import java.io.File;
import java.util.List;
import javax.swing.SwingUtilities;
import javax.swing.event.HyperlinkEvent;
import javax.swing.event.HyperlinkListener;
/**
 * @author Q. Pan
 *
 */
public class NBIADataRetriever extends StandaloneDMDispatcher {
	private static List<File> files;
	static{
		Application.getApplication().setOpenFileHandler((AppEvent.OpenFilesEvent ofe) -> {
		files = ofe.getFiles();
		});
    };

	public static void main(String[] args) {
		SwingUtilities.invokeLater(() -> {
			StandaloneDMDispatcher app = new StandaloneDMDispatcher();
			
			if (files != null && files.size() > 0) {
				try {
					app.loadManifestFile(files.get(0).getAbsolutePath());
					app.launch();
				} catch (Exception e) {
					JOptionPane.showMessageDialog(null, StandaloneDMDispatcher.launchMsg);
					e.printStackTrace();
				}
			} 
			else
			if  (args.length > 0) {
				File f = new File(args[0]);
			
				if (f.exists() && f.isFile()) {
					app.loadManifestFile(args[0]);
					app.launch();
				}
			} else {
			    // for copying style
			    JLabel label = new JLabel();
			    Font font = label.getFont();
			    // create some css from the label's font
			    StringBuffer style = new StringBuffer("font-family:" + font.getFamily() + ";");
			    style.append("font-weight:" + (font.isBold() ? "bold" : "normal") + ";");
			    style.append("font-size:" + font.getSize() + "pt;");
				
			    // html content
			    JEditorPane ep = new JEditorPane("text/html", "<html><body style=\"" + style + "\">" //
			            + StandaloneDMDispatcher.launchMsg + "<a href=\"" + StandaloneDMDispatcher.youTubeLink + "\">video tutorial</a>." //
			            + "</body></html>");

			    // handle link events
			    ep.addHyperlinkListener(new HyperlinkListener()
			    {
			        @Override
			        public void hyperlinkUpdate(HyperlinkEvent e)
			        {
			            if (e.getEventType().equals(HyperlinkEvent.EventType.ACTIVATED))
			            	BrowserLauncher.openUrl(e.getURL().toString());
			        }
			    });
			    ep.setEditable(false);
			    ep.setBackground(label.getBackground());

			    // show
			    JOptionPane.showMessageDialog(null, ep);
			}
		});
	}
}