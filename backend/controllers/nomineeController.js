import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import Nominee from '../models/Nominee.js';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // your email
      pass: process.env.SMTP_PASS, // your email password or app password
    },
  });
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/nominees';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow only specific file types
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG, and PNG files are allowed!'));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// Register a new nominee
export const registerNominee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address,
      aadharNumber,
      phoneNumber,
      dateOfBirth,
      gender,
      relationWithUser,
      userAadharNumber
    } = req.body;

    // Check if nominee already exists
    const existingNominee = await Nominee.findOne({
      $or: [
        { email },
        { aadharNumber }
      ]
    });

    if (existingNominee) {
      return res.status(400).json({
        success: false,
        message: 'Nominee with this email or Aadhar number already exists'
      });
    }

    // Verify that the user exists (the person they're nominating for)
    const linkedUser = await User.findOne({ aadharNumber: userAadharNumber });
    if (!linkedUser) {
      return res.status(400).json({
        success: false,
        message: 'No user found with the provided Aadhar number. Please verify the Aadhar number.'
      });
    }

    // Check if this user already has a nominee
    const existingNomineeForUser = await Nominee.findOne({ userAadharNumber });
    if (existingNomineeForUser) {
      return res.status(400).json({
        success: false,
        message: 'This user already has a nominee registered'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create nominee
    const nominee = new Nominee({
      name,
      email,
      password: hashedPassword,
      address,
      aadharNumber,
      phoneNumber,
      dateOfBirth,
      gender,
      relationWithUser,
      userAadharNumber,
      linkedUserDetails: {
        name: linkedUser.name,
        aadharNumber: linkedUser.aadharNumber,
        phoneNumber: linkedUser.phoneNumber,
        email: linkedUser.email,
        address: linkedUser.address,
        dateOfBirth: linkedUser.dateOfBirth,
        gender: linkedUser.gender,
        pensionStatus: 'Active',
        lastLogin: linkedUser.updatedAt,
        medicalStatus: 'Unknown',
        deathStatus: 'Alive'
      }
    });

    await nominee.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        nomineeId: nominee._id, 
        email: nominee.email,
        userType: 'nominee'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Nominee registered successfully',
      token,
      userType: 'nominee',
      nominee: {
        id: nominee._id,
        name: nominee.name,
        email: nominee.email,
        relationWithUser: nominee.relationWithUser,
        userAadharNumber: nominee.userAadharNumber
      }
    });

  } catch (error) {
    console.error('Nominee registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during nominee registration'
    });
  }
};

// Login nominee
export const loginNominee = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find nominee by email
    const nominee = await Nominee.findOne({ email });
    if (!nominee) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if nominee is active
    if (!nominee.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your nominee account has been deactivated. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, nominee.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        nomineeId: nominee._id, 
        email: nominee.email,
        userType: 'nominee'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Nominee login successful',
      token,
      userType: 'nominee',
      nominee: {
        id: nominee._id,
        name: nominee.name,
        email: nominee.email,
        relationWithUser: nominee.relationWithUser,
        userAadharNumber: nominee.userAadharNumber
      }
    });

  } catch (error) {
    console.error('Nominee login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during nominee login'
    });
  }
};

// Get nominee profile
export const getNomineeProfile = async (req, res) => {
  try {
    const nominee = await Nominee.findById(req.nomineeId).select('-password');
    if (!nominee) {
      return res.status(404).json({
        success: false,
        message: 'Nominee not found'
      });
    }

    res.json({
      success: true,
      nominee
    });

  } catch (error) {
    console.error('Get nominee profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching nominee profile'
    });
  }
};

// Update nominee profile
export const updateNomineeProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password updates through this route
    delete updates.userAadharNumber; // Don't allow changing linked user
    delete updates.aadharNumber; // Don't allow changing Aadhar

    const nominee = await Nominee.findByIdAndUpdate(
      req.nomineeId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!nominee) {
      return res.status(404).json({
        success: false,
        message: 'Nominee not found'
      });
    }

    res.json({
      success: true,
      message: 'Nominee profile updated successfully',
      nominee
    });

  } catch (error) {
    console.error('Update nominee profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating nominee profile'
    });
  }
};

// Upload document
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { type } = req.body;
    const file = req.file;

    // Validate document type
    if (!type || !['Death Certificate', 'Medical Document'].includes(type)) {
      // Delete the uploaded file if validation fails
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid document type. Must be either "Death Certificate" or "Medical Document"'
      });
    }

    const nominee = await Nominee.findById(req.nomineeId);
    if (!nominee) {
      // Delete the uploaded file if nominee not found
      fs.unlinkSync(file.path);
      return res.status(404).json({
        success: false,
        message: 'Nominee not found'
      });
    }

    // Add document to nominee's documents array
    const document = {
      type,
      fileName: file.originalname,
      filePath: file.path,
      uploadDate: new Date(),
      status: 'Pending'
    };

    nominee.documents.push(document);
    await nominee.save();

    // Send email notification for both medical documents and death certificates
    if (type === 'Medical Document' || type === 'Death Certificate') {
      console.log(`📧 Attempting to send email for ${type} upload`);
      try {
        const transporter = createTransporter();
        console.log('📧 Email transporter created successfully');
        
        // Determine email styling based on document type
        const isMedicalDoc = type === 'Medical Document';
        const gradientColor = isMedicalDoc ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' : 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)';
        const alertTitle = isMedicalDoc ? 'Medical Document Upload Alert' : 'Death Certificate Upload Alert';
        const urgencyText = isMedicalDoc ? 'Medical Document' : 'Death Certificate';
        
        const mailOptions = {
          from: process.env.SMTP_USER,
          to: 'setunidhi0@gmail.com', // Target email address
          subject: `${type} Uploaded - ${nominee.linkedUserDetails.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: ${gradientColor}; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">${alertTitle}</h1>
              </div>
              
              <div style="padding: 30px; background: #f8f9fa;">
                <h2 style="color: #333; margin-top: 0;">Document Upload Details</h2>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; background: #f1f1f1; font-weight: bold; width: 30%;">Nominee Name:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${nominee.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; background: #f1f1f1; font-weight: bold;">Nominee Email:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${nominee.email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; background: #f1f1f1; font-weight: bold;">Linked User:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${nominee.linkedUserDetails.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; background: #f1f1f1; font-weight: bold;">User Aadhar:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${nominee.linkedUserDetails.aadharNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; background: #f1f1f1; font-weight: bold;">Document Type:</td>
                    <td style="padding: 10px; border: 1px solid #ddd; color: #e74c3c; font-weight: bold;">${type}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; background: #f1f1f1; font-weight: bold;">File Name:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${file.originalname}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; background: #f1f1f1; font-weight: bold;">File Size:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${(file.size / 1024 / 1024).toFixed(2)} MB</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; background: #f1f1f1; font-weight: bold;">Upload Date:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; background: #f1f1f1; font-weight: bold;">Relation:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${nominee.relationWithUser}</td>
                  </tr>
                </table>
                
                <div style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0;">
                  <h4 style="color: #856404; margin-top: 0;">⚠️ Action Required</h4>
                  <p style="color: #856404; margin: 10px 0;">
                    A ${type.toLowerCase()} has been uploaded for <strong>${nominee.linkedUserDetails.name}</strong> by their nominee <strong>${nominee.name}</strong>. 
                    ${isMedicalDoc ? 
                      'Please review the document and take appropriate action regarding the user\'s medical status and benefits eligibility.' :
                      'Please review the death certificate and process the transfer of pension benefits to the nominee as per government regulations.'
                    }
                  </p>
                </div>
                
                <div style="background: #d1ecf1; padding: 15px; border-radius: 5px; border-left: 4px solid #17a2b8; margin: 20px 0;">
                  <h4 style="color: #0c5460; margin-top: 0;">Next Steps</h4>
                  <ul style="color: #0c5460; margin: 10px 0;">
                    ${isMedicalDoc ? 
                      `<li>Review the uploaded medical document</li>
                       <li>Verify the authenticity of the document</li>
                       <li>Update the user's medical status in the system</li>
                       <li>Contact the nominee if additional information is required</li>
                       <li>Process any necessary benefit adjustments</li>` :
                      `<li>Review the uploaded death certificate</li>
                       <li>Verify the authenticity and validity of the certificate</li>
                       <li>Update the user's status to deceased in the system</li>
                       <li>Transfer pension benefits to the nominee</li>
                       <li>Contact the nominee for any additional documentation</li>
                       <li>Process the benefit transfer as per government guidelines</li>`
                    }
                  </ul>
                </div>
                
                <div style="background: #f8d7da; padding: 15px; border-radius: 5px; border-left: 4px solid #dc3545; margin: 20px 0;">
                  <h4 style="color: #721c24; margin-top: 0;">Important Note</h4>
                  <p style="color: #721c24; margin: 10px 0;">
                    This is an automated notification. Please ensure timely review and processing of this ${type.toLowerCase()} upload to maintain service quality and user satisfaction.
                    ${isMedicalDoc ? '' : ' Death certificate uploads require immediate attention and processing.'}
                  </p>
                </div>
              </div>
              
              <div style="background: #333; color: white; padding: 20px; text-align: center;">
                <p style="margin: 0;">Government Benefits Platform - ${type} Alert</p>
                <p style="margin: 5px 0 0 0; font-size: 12px;">Time: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          `,
          attachments: [
            {
              filename: file.originalname,
              path: file.path,
              contentType: file.mimetype
            }
          ]
        };

        console.log('📧 Sending email with options:', {
          from: mailOptions.from,
          to: mailOptions.to,
          subject: mailOptions.subject
        });
        
        await transporter.sendMail(mailOptions);
        console.log(`✅ ${type} email sent successfully to setunidhi0@gmail.com`);
      } catch (emailError) {
        console.error(`❌ Error sending ${type.toLowerCase()} email:`, emailError.message);
        console.error('Email error details:', {
          code: emailError.code,
          command: emailError.command,
          response: emailError.response
        });
        // Don't fail the upload if email fails
      }
    }

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      document: document
    });

  } catch (error) {
    console.error('Upload document error:', error);
    
    // Delete the uploaded file if there was an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error while uploading document'
    });
  }
};

// Get nominee documents
export const getNomineeDocuments = async (req, res) => {
  try {
    const nominee = await Nominee.findById(req.nomineeId).select('documents');
    if (!nominee) {
      return res.status(404).json({
        success: false,
        message: 'Nominee not found'
      });
    }

    res.json({
      success: true,
      documents: nominee.documents
    });

  } catch (error) {
    console.error('Get nominee documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching documents'
    });
  }
};

// Delete document
export const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    // Validate documentId
    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: 'Document ID is required'
      });
    }

    console.log('Deleting document:', { documentId, nomineeId: req.nomineeId });

    const nominee = await Nominee.findById(req.nomineeId);
    if (!nominee) {
      return res.status(404).json({
        success: false,
        message: 'Nominee not found'
      });
    }

    // Find the document to delete
    const documentIndex = nominee.documents.findIndex(doc => doc._id.toString() === documentId);
    if (documentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    const document = nominee.documents[documentIndex];
    console.log('Found document to delete:', { 
      fileName: document.fileName, 
      type: document.type, 
      filePath: document.filePath 
    });
    
    // Delete the file from filesystem
    if (document.filePath && fs.existsSync(document.filePath)) {
      try {
        fs.unlinkSync(document.filePath);
        console.log('File deleted from filesystem:', document.filePath);
      } catch (fileError) {
        console.error('Error deleting file from filesystem:', fileError);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Remove document from array
    nominee.documents.splice(documentIndex, 1);
    await nominee.save();

    console.log('Document deleted successfully from database');

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Delete document error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      documentId: req.params.documentId,
      nomineeId: req.nomineeId
    });
    
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting document'
    });
  }
};

// Update linked user status
export const updateLinkedUserStatus = async (req, res) => {
  try {
    const { medicalStatus, deathStatus } = req.body;

    const nominee = await Nominee.findById(req.nomineeId);
    if (!nominee) {
      return res.status(404).json({
        success: false,
        message: 'Nominee not found'
      });
    }

    // Update linked user status
    if (medicalStatus) {
      nominee.linkedUserDetails.medicalStatus = medicalStatus;
    }
    if (deathStatus) {
      nominee.linkedUserDetails.deathStatus = deathStatus;
    }

    await nominee.save();

    res.json({
      success: true,
      message: 'Linked user status updated successfully',
      linkedUserDetails: nominee.linkedUserDetails
    });

  } catch (error) {
    console.error('Update linked user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating linked user status'
    });
  }
};

// Logout nominee
export const logoutNominee = async (req, res) => {
  try {
    // In a more sophisticated setup, you might want to blacklist the token
    res.json({
      success: true,
      message: 'Nominee logged out successfully'
    });
  } catch (error) {
    console.error('Nominee logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during logout'
    });
  }
};
