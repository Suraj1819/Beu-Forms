// models/StudentFeedback.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

// Define interfaces for TypeScript
interface IStudentFeedback extends Document {
  studentId: string;
  studentName: string;
  email: string;
  department: string;
  semester: string;
  degreeProgram: string;
  academicYear: string;
  courseCode: string;
  courseName: string;
  facultyName: string;
  ratingTeaching: number;
  ratingContent: number;
  ratingEvaluation: number;
  ratingFacilities: number;
  ratingOverall: number;
  strengths: string;
  improvements: string;
  suggestions: string;
  placementSupport: string;
  libraryFacilities: string;
  labFacilities: string;
  hostelFacilities: string;
  sportsFacilities: string;
  careerGuidance: string;
  extracurricular: string;
  campusEnvironment: string;
  adminSupport: string;
  additionalComments: string;
  recommendImprovements: string[];
  willingToParticipate: boolean;
  contactForFollowup: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create schema
const StudentFeedbackSchema: Schema = new Schema({
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    trim: true,
    maxlength: [20, 'Student ID cannot exceed 20 characters']
  },
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    minlength: [3, 'Student name must be at least 3 characters'],
    maxlength: [100, 'Student name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    maxlength: [100, 'Email cannot exceed 100 characters']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: {
      values: [
        'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering',
        'Electronics & Communication Engineering', 'Computer Science & Engineering',
        'Information Technology', 'Chemical Technology', 'Biomedical Engineering',
        'Aeronautical Engineering', 'Mining Engineering', 'Agricultural Engineering',
        'Other'
      ],
      message: 'Please select a valid department'
    }
  },
  semester: {
    type: String,
    required: [true, 'Semester is required'],
    enum: {
      values: ['1', '2', '3', '4', '5', '6', '7', '8'],
      message: 'Semester must be between 1 and 8'
    }
  },
  degreeProgram: {
    type: String,
    required: [true, 'Degree program is required'],
    enum: {
      values: ['B.Tech', 'B.Arch', 'M.Tech', 'MBA', 'PhD'],
      message: 'Please select a valid degree program'
    }
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    enum: {
      values: ['2023-24', '2024-25', '2025-26', '2026-27'],
      message: 'Please select a valid academic year'
    }
  },
  courseCode: {
    type: String,
    required: [true, 'Course code is required'],
    trim: true,
    maxlength: [20, 'Course code cannot exceed 20 characters']
  },
  courseName: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
    maxlength: [100, 'Course name cannot exceed 100 characters']
  },
  facultyName: {
    type: String,
    required: [true, 'Faculty name is required'],
    trim: true,
    maxlength: [100, 'Faculty name cannot exceed 100 characters']
  },
  ratingTeaching: {
    type: Number,
    required: [true, 'Teaching rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  ratingContent: {
    type: Number,
    required: [true, 'Content rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  ratingEvaluation: {
    type: Number,
    required: [true, 'Evaluation rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  ratingFacilities: {
    type: Number,
    required: [true, 'Facilities rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  ratingOverall: {
    type: Number,
    required: [true, 'Overall rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  strengths: {
    type: String,
    required: [true, 'Strengths feedback is required'],
    minlength: [20, 'Strengths must be at least 20 characters'],
    maxlength: [1000, 'Strengths cannot exceed 1000 characters']
  },
  improvements: {
    type: String,
    required: [true, 'Improvements feedback is required'],
    minlength: [20, 'Improvements must be at least 20 characters'],
    maxlength: [1000, 'Improvements cannot exceed 1000 characters']
  },
  suggestions: {
    type: String,
    maxlength: [1000, 'Suggestions cannot exceed 1000 characters'],
    default: ''
  },
  placementSupport: {
    type: String,
    enum: {
      values: ['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable'],
      message: 'Please select a valid rating for placement support',
      default: 'Not Applicable'
    }
  },
  libraryFacilities: {
    type: String,
    enum: {
      values: ['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable'],
      message: 'Please select a valid rating for library facilities',
      default: 'Not Applicable'
    }
  },
  labFacilities: {
    type: String,
    enum: {
      values: ['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable'],
      message: 'Please select a valid rating for lab facilities',
      default: 'Not Applicable'
    }
  },
  hostelFacilities: {
    type: String,
    enum: {
      values: ['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable'],
      message: 'Please select a valid rating for hostel facilities',
      default: 'Not Applicable'
    }
  },
  sportsFacilities: {
    type: String,
    enum: {
      values: ['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable'],
      message: 'Please select a valid rating for sports facilities',
      default: 'Not Applicable'
    }
  },
  careerGuidance: {
    type: String,
    enum: {
      values: ['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable'],
      message: 'Please select a valid rating for career guidance',
      default: 'Not Applicable'
    }
  },
  extracurricular: {
    type: String,
    enum: {
      values: ['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable'],
      message: 'Please select a valid rating for extracurricular activities',
      default: 'Not Applicable'
    }
  },
  campusEnvironment: {
    type: String,
    enum: {
      values: ['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable'],
      message: 'Please select a valid rating for campus environment',
      default: 'Not Applicable'
    }
  },
  adminSupport: {
    type: String,
    enum: {
      values: ['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable'],
      message: 'Please select a valid rating for administrative support',
      default: 'Not Applicable'
    }
  },
  additionalComments: {
    type: String,
    maxlength: [1500, 'Additional comments cannot exceed 1500 characters'],
    default: ''
  },
  recommendImprovements: {
    type: [String],
    default: []
  },
  willingToParticipate: {
    type: Boolean,
    default: false
  },
  contactForFollowup: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Create indexes for better query performance
StudentFeedbackSchema.index({ studentId: 1, courseCode: 1, academicYear: 1 });
StudentFeedbackSchema.index({ department: 1, semester: 1 });
StudentFeedbackSchema.index({ createdAt: -1 });
StudentFeedbackSchema.index({ facultyName: 1 });
StudentFeedbackSchema.index({ courseName: 1 });

// Middleware to transform ratings from string to number before saving
StudentFeedbackSchema.pre('save', function(next) {
  const ratingFields = [
    'ratingTeaching', 'ratingContent', 'ratingEvaluation',
    'ratingFacilities', 'ratingOverall'
  ];

  ratingFields.forEach(field => {
    if (this[field] && typeof this[field] === 'string') {
      this[field] = parseInt(this[field]);
    }
  });

  next();
});

// Create the model
const StudentFeedback: Model<IStudentFeedback> = mongoose.models.StudentFeedback || 
  mongoose.model<IStudentFeedback>('StudentFeedback', StudentFeedbackSchema);

export default StudentFeedback;