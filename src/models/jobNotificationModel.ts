import mongoose, { Schema, Document, Model } from 'mongoose';

// ✅ FIXED: Proper TypeScript Interfaces
export interface IJobNotification {
  // Company Information
  email: string;
  companyName: string;
  aboutCompany: string;
  correspondenceAddress: string;
  dateOfEstablishment?: Date | null;
  numberOfEmployees: string;
  socialMediaLink: string;
  website: string;
  typeOfOrganization: string;
  mncHeadOffice: string;

  // Nature of Business
  natureOfBusiness: string[];

  // HR & Contact Information
  headHRName: string;
  headHRContact: string;
  headHREmail: string;
  firstContactName: string;
  firstContactEmail: string;
  firstContactPhone: string;
  secondContactName: string;
  secondContactEmail: string;
  secondContactPhone: string;

  // Job Details
  jobProfile: string;
  jobTitle: string;
  jobDescription: string;
  minHires: string;
  expectedHires: string;
  jobLocation: string;
  requiredSkills: string;

  // Eligibility
  eligibleDegrees: string[];
  eligibleBTechDepartments: string[];
  eligibleMTechDepartments: string[];
  eligiblePhDDepartments: string[];

  // Role-specific Details
  jobDesignationBTech: string;
  jobDescBTech: string;
  jobDesignationMTech: string;
  jobDescMTech: string;
  jobDesignationPhD: string;
  jobDescPhD: string;

  // Selection Process
  cgpaCutoff: string;
  backlogEligibility: string;
  modeOfSelection: string;
  selectionRounds: string[];
  totalRounds: string;
  syllabus: string;

  // Metadata
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'On Hold';
  submissionDate: Date;
  lastUpdated: Date;
  reviewedBy: string;
  reviewNotes: string;
  isActive: boolean;
  applicationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobNotificationMethods {
  approve(reviewerName: string, notes?: string): Promise<this>;
  reject(reviewerName: string, notes?: string): Promise<this>;
  putOnHold(reviewerName: string, notes?: string): Promise<this>;
}

export interface IJobNotificationStatics {
  getActiveJobs(): Promise<IJobNotificationDocument[]>;
  getPendingJobs(): Promise<IJobNotificationDocument[]>;
  getJobsByCompany(companyName: string): Promise<IJobNotificationDocument[]>;
}

// ✅ FIXED: Export IJobNotificationDocument
export interface IJobNotificationDocument 
  extends IJobNotification, 
         IJobNotificationMethods, 
         Document {
  _id: mongoose.Types.ObjectId;
}

export interface IJobNotificationModel 
  extends Model<IJobNotificationDocument>, 
         IJobNotificationStatics {}

// ✅ FIXED: Export JobNotificationDocument type alias (for backward compatibility)
export type JobNotificationDocument = IJobNotificationDocument;

// ✅ FIXED: Perfect Schema
const jobNotificationSchema = new Schema<IJobNotificationDocument, IJobNotificationModel>(
  {
    // Company Information
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },

    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [200, 'Company name cannot exceed 200 characters']
    },

    aboutCompany: {
      type: String,
      required: [true, 'About company is required'],
      trim: true,
      maxlength: [2000, 'About company cannot exceed 2000 characters']
    },

    correspondenceAddress: {
      type: String,
      required: [true, 'Correspondence address is required'],
      trim: true,
      maxlength: [500, 'Address cannot exceed 500 characters']
    },

    dateOfEstablishment: {
      type: Date,
      default: null
    },

    numberOfEmployees: {
      type: String,
      trim: true,
      default: ''
    },

    socialMediaLink: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: function(v: string) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Please enter a valid URL'
      }
    },

    website: {
      type: String,
      required: [true, 'Website is required'],
      trim: true,
      match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
    },

    typeOfOrganization: {
      type: String,
      required: [true, 'Type of organization is required'],
      enum: {
        values: [
          'Private',
          'MNC(Indian Origin)',
          'MNC(Foreign Origin)',
          'Government',
          'PSUs',
          'NGO',
          'STARTUP',
          'Other'
        ],
        message: 'Please select a valid organization type'
      }
    },

    mncHeadOffice: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'Head office details cannot exceed 300 characters']
    },

    // Nature of Business
    natureOfBusiness: [{
      type: String,
      enum: [
        'Core Engineering & technology', 'Analytics', 'IT/Software', 'Oil & Gas',
        'Data Science', 'Cyber Security', 'Finance & Consulting', 'Management',
        'Teaching/Research', 'Media', 'E-Commerce', 'Construction',
        'Design', 'Manufacturing', 'Infrastructure', 'Other'
      ]
    }],

    // HR & Contact Information
    headHRName: {
      type: String,
      required: [true, 'Head HR name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },

    headHRContact: {
      type: String,
      required: [true, 'Head HR contact is required'],
      trim: true,
      match: [/^[\+]?[0-9\s\-\(\)]{10,15}$/, 'Please enter a valid phone number']
    },

    headHREmail: {
      type: String,
      required: [true, 'Head HR email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },

    firstContactName: {
      type: String,
      required: [true, 'First contact name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },

    firstContactEmail: {
      type: String,
      required: [true, 'First contact email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },

    firstContactPhone: {
      type: String,
      required: [true, 'First contact phone is required'], 
      trim: true,
      match: [/^[\+]?[0-9\s\-\(\)]{10,15}$/, 'Please enter a valid phone number']
    },

    secondContactName: {
      type: String,
      required: [true, 'Second contact name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },

    secondContactEmail: {
      type: String,
      required: [true, 'Second contact email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },

    secondContactPhone: {
      type: String,
      required: [true, 'Second contact phone is required'],
      trim: true,
      match: [/^[\+]?[0-9\s\-\(\)]{10,15}$/, 'Please enter a valid phone number']
    },

    // Job Details
    jobProfile: {
      type: String,
      required: [true, 'Job profile is required'],
      trim: true,
      maxlength: [150, 'Job profile cannot exceed 150 characters']
    },

    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [150, 'Job title cannot exceed 150 characters']
    },

    jobDescription: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
      maxlength: [2000, 'Job description cannot exceed 2000 characters']
    },

    minHires: {
      type: String,
      required: [true, 'Minimum hires is required'],
      validate: {
        validator: function(v: string) {
          return !isNaN(Number(v)) && parseInt(v) >= 0;
        },
        message: 'Minimum hires must be a valid number'
      }
    },

    expectedHires: {
      type: String,
      required: [true, 'Expected hires is required'],
      validate: {
        validator: function(v: string) {
          return !isNaN(Number(v)) && parseInt(v) >= 0;
        },
        message: 'Expected hires must be a valid number'
      }
    },

    jobLocation: {
      type: String,
      required: [true, 'Job location is required'],
      trim: true,
      maxlength: [300, 'Job location cannot exceed 300 characters']
    },

    requiredSkills: {
      type: String,
      required: [true, 'Required skills is required'],
      trim: true,
      maxlength: [1500, 'Required skills cannot exceed 1500 characters']
    },

    // Eligibility Criteria
    eligibleDegrees: [{
      type: String,
      enum: ['B. Tech(4 years)', 'B.Arch(5 years)', 'M.Tech (2 years)', 'MBA', 'PhD']
    }],

    eligibleBTechDepartments: [{
      type: String,
      enum: [
        'All', 'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering',
        'Electronics & Communication Engineering', 'Computer Science & Engineering',
        'Information Technology', 'Chemical Technology (Leather Technology)',
        'Biomedical & Robotic Engineering', 'Electrical & Electronics Engineering',
        'Civil Engineering with Computer Application', 'Computer Science & Engineering (AI)',
        'Fire Technology & Safety', 'Computer Science & Engineering (Cyber Security)',
        'Aeronautical Engineering', 'Food Processing & Preservation',
        'Computer Science & Engineering (IoT)', 'Electronics & Communication Engineering (Advance Communication Technology)',
        'Computer Science & Engineering(AI & ML)', 'Chemical Engineering',
        'Computer Science & Engineering(Data Science)', 'Electronics Engineering (VLSI Design & Technology)',
        'Mining Engineering', '3-D Animation & Graphics', 'Mechanical & Smart Manufacturing',
        'Mechatronics Engineering', 'Computer Science & Engineering (Networks)',
        'Computer Science & Engg (IOT & Cyber Security including Block Chain Technology)',
        'Robotics and Automation', 'Instrumentation Engineering', 'Agricultural Engineering',
        'Waste Management', 'Petrochemical Engineering', 'Chemical Engineering (Plastic & Polymer)',
        'Marine Engineering', 'B.Arch', 'Not Applicable'
      ]
    }],

    eligibleMTechDepartments: [{
      type: String,
      enum: [
        'All', 'Machine Design', 'Thermal Engineering', 'Manufacturing Technology',
        'Energy System and Management', 'Manufacturing Engineering',
        'Advanced Electronics and Communication Engineering', 'VLSI Design',
        'Signal Processing and VLSI Technology', 'Micro Electronics & VLSI Technology',
        'Advance Communication Technology', 'Electronics and Communication Engineering',
        'Geotechnical Engineering', 'Transportation Engineering', 'Structural Engineering',
        'Computer Science & Engineering', 'Cyber Security', 'Electrical Energy Systems',
        'Power System', 'Electrical Power System', 'Geoinformatics', 'MBA', 'Not Applicable'
      ]
    }],

    eligiblePhDDepartments: [{
      type: String,
      enum: [
        'All', 'Civil Engineering', 'Computer Science and Engineering',
        'Electrical Engineering', 'Electronics and Communication Engineering',
        'Mechanical Engineering', 'Not Applicable'
      ]
    }],

    // Role-specific Details
    jobDesignationBTech: {
      type: String,
      required: [true, 'B.Tech job designation is required'],
      trim: true,
      maxlength: [150, 'Job designation cannot exceed 150 characters']
    },

    jobDescBTech: {
      type: String,
      required: [true, 'B.Tech job description is required'],
      trim: true,
      maxlength: [1000, 'Job description cannot exceed 1000 characters']
    },

    jobDesignationMTech: {
      type: String,
      required: [true, 'M.Tech job designation is required'],
      trim: true,
      maxlength: [150, 'Job designation cannot exceed 150 characters']
    },

    jobDescMTech: {
      type: String,
      required: [true, 'M.Tech job description is required'],
      trim: true,
      maxlength: [1000, 'Job description cannot exceed 1000 characters']
    },

    jobDesignationPhD: {
      type: String,
      required: [true, 'PhD job designation is required'],
      trim: true,
      maxlength: [150, 'Job designation cannot exceed 150 characters']
    },

    jobDescPhD: {
      type: String,
      required: [true, 'PhD job description is required'],
      trim: true,
      maxlength: [1000, 'Job description cannot exceed 1000 characters']
    },

    // Selection Process
    cgpaCutoff: {
      type: String,
      required: [true, 'CGPA cutoff is required'],
      trim: true,
      maxlength: [50, 'CGPA cutoff cannot exceed 50 characters']
    },

    backlogEligibility: {
      type: String,
      required: [true, 'Backlog eligibility is required'],
      enum: ['Yes', 'No']
    },

    modeOfSelection: {
      type: String,
      required: [true, 'Mode of selection is required'],
      enum: ['Virtual', 'Campus Visit', 'Hybrid']
    },

    selectionRounds: [{
      type: String,
      enum: [
        'Pre-Placement Talk', 'Aptitude Test', 'Technical Test(Online Assessment)',
        'Personal Interview', 'HR Round', 'Group Discussion', 'Psychometric Test',
        'Medical Test', 'Other'
      ]
    }],

    totalRounds: {
      type: String,
      required: [true, 'Total rounds is required'],
      validate: {
        validator: function(v: string) {
          const num = parseInt(v);
          return !isNaN(num) && num >= 1 && num <= 10;
        },
        message: 'Total rounds must be between 1 and 10'
      }
    },

    syllabus: {
      type: String,
      trim: true,
      default: '',
      maxlength: [2000, 'Syllabus cannot exceed 2000 characters']
    },

    // Metadata
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'On Hold'],
      default: 'Pending'
    },

    submissionDate: {
      type: Date,
      default: Date.now
    },

    lastUpdated: {
      type: Date,
      default: Date.now
    },

    reviewedBy: {
      type: String,
      trim: true,
      default: ''
    },

    reviewNotes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Review notes cannot exceed 1000 characters']
    },

    isActive: {
      type: Boolean,
      default: true
    },

    applicationId: {
      type: String,
      unique: true,
      default: function() {
        return 'JNF' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// ✅ FIXED: Perfect Indexes
jobNotificationSchema.index({ companyName: 1 });
jobNotificationSchema.index({ email: 1 });
jobNotificationSchema.index({ submissionDate: -1 });
jobNotificationSchema.index({ status: 1 });
jobNotificationSchema.index({ applicationId: 1 }, { unique: true });

// ✅ FIXED: Pre-save middleware
jobNotificationSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// ✅ FIXED: Static Methods
jobNotificationSchema.statics.getActiveJobs = function() {
  return this.find({ isActive: true, status: 'Approved' })
    .sort({ submissionDate: -1 })
    .lean();
};

jobNotificationSchema.statics.getPendingJobs = function() {
  return this.find({ status: 'Pending' })
    .sort({ submissionDate: -1 })
    .lean();
};

jobNotificationSchema.statics.getJobsByCompany = function(companyName: string) {
  return this.find({
    companyName: { $regex: companyName, $options: 'i' },
    isActive: true
  })
    .sort({ submissionDate: -1 })
    .lean();
};

// ✅ FIXED: Instance Methods
jobNotificationSchema.methods.approve = async function(reviewerName: string, notes: string = '') {
  this.status = 'Approved';
  this.reviewedBy = reviewerName;
  this.reviewNotes = notes;
  this.lastUpdated = new Date();
  return this.save();
};

jobNotificationSchema.methods.reject = async function(reviewerName: string, notes: string = '') {
  this.status = 'Rejected';
  this.reviewedBy = reviewerName;
  this.reviewNotes = notes;
  this.lastUpdated = new Date();
  return this.save();
};

jobNotificationSchema.methods.putOnHold = async function(reviewerName: string, notes: string = '') {
  this.status = 'On Hold';
  this.reviewedBy = reviewerName;
  this.reviewNotes = notes;
  this.lastUpdated = new Date();
  return this.save();
};

// ✅ FIXED: JSON Transform
jobNotificationSchema.set('toJSON', {
  transform: function(doc, ret) {
    const { _id, __v, ...rest } = ret;
    return {
      ...rest,
      id: _id
    };
  }
});

// ✅ FIXED: Perfect Model Creation
const JobNotification: IJobNotificationModel = (mongoose.models.JobNotification as IJobNotificationModel) || 
  mongoose.model<IJobNotificationDocument, IJobNotificationModel>('JobNotification', jobNotificationSchema);

export default JobNotification;