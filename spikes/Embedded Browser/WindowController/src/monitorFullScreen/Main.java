package monitorFullScreen;


import java.awt.BorderLayout;
import java.awt.GraphicsDevice;
import java.awt.GraphicsEnvironment;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

public class Main {
	
	static GraphicsDevice device = GraphicsEnvironment
	        .getLocalGraphicsEnvironment().getScreenDevices()[0];

	 public static void main(String[] args) {
	      SwingUtilities.invokeLater(new Runnable() {
	         public void run() {
	            createAndShowGui();
	         }
	      });
	   }
	
	   private static void createAndShowGui() {
		      MoveRect mainPanel = new MoveRect(0, 0);
		      MoveRect second = new MoveRect(50, 50);
		      MoveRect third = new MoveRect(100, 100);
		      
		      

		      JFrame frame = new JFrame("MoveRect");
		      frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		      frame.setLayout(new BorderLayout());
		      frame.setUndecorated(true);
		      //device.setFullScreenWindow(frame);
		      
		      
		      
		      JButton btn1 = new JButton("Full-Screen");
		      btn1.addActionListener(new ActionListener() {
		          @Override
		          public void actionPerformed(ActionEvent e) {
		              device.setFullScreenWindow(frame);
		          }
		      });
		      
		      JButton btn2 = new JButton("Normal");
		      btn2.addActionListener(new ActionListener() {
		          @Override
		          public void actionPerformed(ActionEvent e) {
		              device.setFullScreenWindow(null);
		          }
		      });
		      
		      JPanel fourth = new JPanel();
		      fourth.add(btn1);
		      fourth.add(btn2);
		      frame.getContentPane().add(fourth, BorderLayout.EAST);
		      
		      
		      
		      frame.getContentPane().add(mainPanel, BorderLayout.NORTH);
		      frame.getContentPane().add(second, BorderLayout.CENTER);
		      frame.getContentPane().add(third, BorderLayout.SOUTH);
		      
		      frame.pack();
		      frame.setLocationByPlatform(true);
		      frame.setVisible(true);
		   }

		  
		   
}

