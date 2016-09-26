/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gov.nih.nci.nbia.dicomapi;

import java.io.*;
// SAX classes.

//JAXP 
import javax.xml.transform.*;
import javax.xml.transform.stream.*;
import javax.xml.transform.sax.*;


import java.util.ArrayList;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.*;

import org.xml.sax.InputSource;
import org.xml.sax.XMLReader;
//import pt.ua.dicoogle.DebugManager;
//import pt.ua.dicoogle.sdk.Utils.Platform;

/**
 *
 * @author Lu√≠s A. Basti√£o Silva <bastiao@ua.pt>
 */
public class LogXML extends DefaultHandler
{

   // private final String filename = Platform.homePath() + "DICOM_Services_Log.xml";
	private final String filename = "DICOM_Services_Log.xml";
    private LogDICOM logs = null;
    private boolean logOn = false;
    private String type = "";
    private String date = "";
    private String ae = "";
    private String add = "";

    public LogXML()
    {
        logs = LogDICOM.getInstance();

    }

    @Override
    public void startElement(String uri, String localName, String qName,
            Attributes attr)
    {
        if (localName.equals("log"))
        {
            this.logOn = true;
        } else if (this.logOn && !localName.equals(""))
        {
            //...
            this.type = localName;
            this.ae = this.resolveAttrib("ae", attr, localName);
            this.date = this.resolveAttrib("date", attr, localName);
            this.add = this.resolveAttrib("add", attr, localName);
        }
    }

    @Override
    public void endElement(String uri, String localName, String qName)
    {

        if (localName.equals("log"))
        {
            this.logOn = false;
        } else if (!localName.equals(""))
        {
            logs.addLine(new LogLine(type, date, ae, add));
        }
    }

    private String resolveAttrib(String attr, Attributes attribs, String defaultValue)
    {
        String tmp = attribs.getValue(attr);
        return (tmp != null) ? (tmp) : (defaultValue);
    }

    public LogDICOM getXML()
    {
        try
        {
            File file = new File(filename);
            if (!file.exists())
            {

                return logs;
            }
            //DebugManager.getInstance().debug("Parsing now DICOM Services Log XML");

            InputSource src = new InputSource(new FileInputStream(file));
            XMLReader r = null;
            try
            {
                r = XMLReaderFactory.createXMLReader();
            } catch (SAXException ex)
            {
            }
            r.setContentHandler(this);
            r.parse(src);
            return logs;
        } catch (IOException ex)
        {
        } catch (SAXException ex)
        {
        }
        return null;
    }

    public void printXML() throws TransformerConfigurationException
    {


        FileOutputStream out = null;

        try
        {
            out = new FileOutputStream(filename);
            PrintWriter pw = new PrintWriter(out);
            StreamResult streamResult = new StreamResult(pw);
            SAXTransformerFactory tf = (SAXTransformerFactory) TransformerFactory.newInstance();
            //      SAX2.0 ContentHandler.
            TransformerHandler hd = tf.newTransformerHandler();
            Transformer serializer = hd.getTransformer();
            serializer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
            serializer.setOutputProperty(OutputKeys.METHOD, "xml");
            serializer.setOutputProperty(OutputKeys.INDENT, "yes");
            serializer.setOutputProperty(OutputKeys.STANDALONE, "yes");
            hd.setResult(streamResult);
            hd.startDocument();

            //Get a processing instruction
            //hd.processingInstruction("xml-stylesheet", "type=\"text/xsl\" href=\"mystyle.xsl\"");
            AttributesImpl atts = new AttributesImpl();


            //root element
            hd.startElement("", "", "log", atts);

            ArrayList<LogLine> list = logs.getLl();
            atts.clear();
            for (LogLine l : list)
            {
                atts.addAttribute("", "", "date", "", l.getDate());
                atts.addAttribute("", "", "ae", "", l.getAe());
                atts.addAttribute("", "", "add", "", l.getAdd());

                hd.startElement("", "", l.getType(), atts);
                atts.clear();

                hd.endElement("", "", l.getType());

            }
            hd.endElement("", "", "log");

            hd.endDocument();

        } catch (TransformerConfigurationException ex)
        {
        } catch (SAXException ex)
        {
        } catch (FileNotFoundException ex)
        {
        } finally
        {
            try
            {
                out.close();
            } catch (IOException ex)
            {
            }
        }

    }
}
