import { EntityManager } from 'typeorm';
import { seedRows, uid } from './helpers';
import type { SeedCtx } from './context';
import {
  Country,
  Division,
  District,
  Upazila,
  Area,
  AreaCoverage,
  Institute,
  InstituteCampus,
  Department,
  Program,
  Semester,
  AcademicSession,
  StudentInstitute,
  InstituteAgent,
  InstituteDocument,
} from '../../admin/areas/entities';

/**
 * Geographic + academic seed. Keys shared across domains:
 *   country:bd, division:dhaka, district:dhaka, upazila:dhanmondi | mirpur |
 *   uttara, area:dhanmondi | mirpur | uttara,
 *   institute:du | buet, department:cse | eee, program:cse | eee,
 *   semester:1 | 2, session:2024 | 2025
 */
export async function seedAreas(
  manager: EntityManager,
  ctx: SeedCtx,
): Promise<void> {
  // --------------------------------------------------------------- countries
  await seedRows(
    manager,
    Country,
    [
      {
        id: uid('country:bd'),
        name: 'Bangladesh',
        isoCode: 'BD',
        phoneCode: '+880',
        currency: 'BDT',
        status: 'ACTIVE',
      },
    ],
    'countries',
  );

  // --------------------------------------------------------------- divisions
  await seedRows(
    manager,
    Division,
    [
      {
        id: uid('division:dhaka'),
        countryId: uid('country:bd'),
        name: 'Dhaka',
        code: 'DHA',
        status: 'ACTIVE',
      },
      {
        id: uid('division:chattogram'),
        countryId: uid('country:bd'),
        name: 'Chattogram',
        code: 'CTG',
        status: 'ACTIVE',
      },
    ],
    'divisions',
  );

  // --------------------------------------------------------------- districts
  await seedRows(
    manager,
    District,
    [
      {
        id: uid('district:dhaka'),
        divisionId: uid('division:dhaka'),
        name: 'Dhaka',
        code: 'DHA-D',
        status: 'ACTIVE',
      },
      {
        id: uid('district:gazipur'),
        divisionId: uid('division:dhaka'),
        name: 'Gazipur',
        code: 'GAZ',
        status: 'ACTIVE',
      },
      {
        id: uid('district:chattogram'),
        divisionId: uid('division:chattogram'),
        name: 'Chattogram',
        code: 'CTG-D',
        status: 'ACTIVE',
      },
    ],
    'districts',
  );

  // ----------------------------------------------------------------- upazilas
  await seedRows(
    manager,
    Upazila,
    [
      {
        id: uid('upazila:dhanmondi'),
        districtId: uid('district:dhaka'),
        name: 'Dhanmondi',
        code: 'DHA-U1',
        status: 'ACTIVE',
      },
      {
        id: uid('upazila:mirpur'),
        districtId: uid('district:dhaka'),
        name: 'Mirpur',
        code: 'DHA-U2',
        status: 'ACTIVE',
      },
      {
        id: uid('upazila:uttara'),
        districtId: uid('district:dhaka'),
        name: 'Uttara',
        code: 'DHA-U3',
        status: 'ACTIVE',
      },
      {
        id: uid('upazila:chattogram-city'),
        districtId: uid('district:chattogram'),
        name: 'Chattogram City',
        code: 'CTG-U1',
        status: 'ACTIVE',
      },
    ],
    'upazilas',
  );

  // -------------------------------------------------------------------- areas
  await seedRows(
    manager,
    Area,
    [
      {
        id: uid('area:dhanmondi'),
        upazilaId: uid('upazila:dhanmondi'),
        name: 'Dhanmondi Residential',
        code: 'DHA-A1',
        postalCode: '1205',
        deliveryCharge: 60,
        minimumDeliveryDays: 1,
        maximumDeliveryDays: 2,
        latitude: 23.7461,
        longitude: 90.3747,
        status: 'ACTIVE',
      },
      {
        id: uid('area:mirpur'),
        upazilaId: uid('upazila:mirpur'),
        name: 'Mirpur Section 2',
        code: 'DHA-A2',
        postalCode: '1216',
        deliveryCharge: 60,
        minimumDeliveryDays: 1,
        maximumDeliveryDays: 2,
        latitude: 23.8069,
        longitude: 90.3687,
        status: 'ACTIVE',
      },
      {
        id: uid('area:uttara'),
        upazilaId: uid('upazila:uttara'),
        name: 'Uttara Sector 7',
        code: 'DHA-A3',
        postalCode: '1230',
        deliveryCharge: 70,
        minimumDeliveryDays: 1,
        maximumDeliveryDays: 2,
        latitude: 23.8759,
        longitude: 90.3795,
        status: 'ACTIVE',
      },
      {
        id: uid('area:ctg-city'),
        upazilaId: uid('upazila:chattogram-city'),
        name: 'GEC Circle',
        code: 'CTG-A1',
        postalCode: '4000',
        deliveryCharge: 80,
        minimumDeliveryDays: 1,
        maximumDeliveryDays: 3,
        latitude: 22.3569,
        longitude: 91.7832,
        status: 'ACTIVE',
      },
    ],
    'areas',
  );

  // ----------------------------------------------------------- area_coverages
  await seedRows(
    manager,
    AreaCoverage,
    [
      {
        id: uid('areacoverage:1'),
        areaId: uid('area:dhanmondi'),
        agentId: uid('agent:1'),
        priority: 1,
        deliveryCharge: 60,
        estimatedTime: 24,
        status: 'ACTIVE',
      },
      {
        id: uid('areacoverage:2'),
        areaId: uid('area:mirpur'),
        agentId: uid('agent:1'),
        priority: 2,
        deliveryCharge: 60,
        estimatedTime: 30,
        status: 'ACTIVE',
      },
      {
        id: uid('areacoverage:3'),
        areaId: uid('area:uttara'),
        agentId: uid('agent:2'),
        priority: 1,
        deliveryCharge: 70,
        estimatedTime: 24,
        status: 'ACTIVE',
      },
      {
        id: uid('areacoverage:4'),
        areaId: uid('area:ctg-city'),
        agentId: uid('agent:2'),
        priority: 2,
        deliveryCharge: 80,
        estimatedTime: 48,
        status: 'ACTIVE',
      },
    ],
    'area_coverages',
  );

  // ---------------------------------------------------------------- institutes
  await seedRows(
    manager,
    Institute,
    [
      {
        id: uid('institute:du'),
        areaId: uid('area:dhanmondi'),
        name: 'University of Dhaka',
        shortName: 'DU',
        type: 'UNIVERSITY',
        address: 'Ramna, Dhaka 1000',
        phone: '02-9661900',
        email: 'info@du.ac.bd',
        website: 'https://www.du.ac.bd',
        latitude: 23.732,
        longitude: 90.405,
        status: 'ACTIVE',
      },
      {
        id: uid('institute:buet'),
        areaId: uid('area:mirpur'),
        name: 'Bangladesh University of Engineering and Technology',
        shortName: 'BUET',
        type: 'UNIVERSITY',
        address: 'Palashi, Dhaka 1205',
        phone: '02-55167100',
        email: 'info@buet.ac.bd',
        website: 'https://www.buet.ac.bd',
        latitude: 23.7266,
        longitude: 90.4054,
        status: 'ACTIVE',
      },
      {
        id: uid('institute:dcc'),
        areaId: uid('area:ctg-city'),
        name: 'Dhaka Commerce College',
        shortName: 'DCC',
        type: 'COLLEGE',
        address: 'Mirpur Road, Dhaka',
        phone: '02-9110000',
        email: 'info@dcc.edu.bd',
        status: 'ACTIVE',
      },
    ],
    'institutes',
  );

  // --------------------------------------------------------- institute_campuses
  await seedRows(
    manager,
    InstituteCampus,
    [
      {
        id: uid('campus:du-main'),
        instituteId: uid('institute:du'),
        name: 'Main Campus',
        address: 'Ramna, Dhaka 1000',
        phone: '02-9661900',
        email: 'main@du.ac.bd',
        status: 'ACTIVE',
      },
      {
        id: uid('campus:buet-main'),
        instituteId: uid('institute:buet'),
        name: 'Main Campus',
        address: 'Palashi, Dhaka 1205',
        phone: '02-55167100',
        email: 'main@buet.ac.bd',
        status: 'ACTIVE',
      },
    ],
    'institute_campuses',
  );

  // -------------------------------------------------------------- departments
  await seedRows(
    manager,
    Department,
    [
      {
        id: uid('department:cse'),
        instituteId: uid('institute:du'),
        name: 'Computer Science and Engineering',
        code: 'CSE',
        status: 'ACTIVE',
      },
      {
        id: uid('department:eee'),
        instituteId: uid('institute:buet'),
        name: 'Electrical and Electronic Engineering',
        code: 'EEE',
        status: 'ACTIVE',
      },
      {
        id: uid('department:bba'),
        instituteId: uid('institute:dcc'),
        name: 'Business Administration',
        code: 'BBA',
        status: 'ACTIVE',
      },
    ],
    'departments',
  );

  // ------------------------------------------------------------------ programs
  await seedRows(
    manager,
    Program,
    [
      {
        id: uid('program:cse'),
        departmentId: uid('department:cse'),
        name: 'B.Sc. in Computer Science',
        code: 'BSC-CSE',
        status: 'ACTIVE',
      },
      {
        id: uid('program:eee'),
        departmentId: uid('department:eee'),
        name: 'B.Sc. in Electrical Engineering',
        code: 'BSC-EEE',
        status: 'ACTIVE',
      },
      {
        id: uid('program:bba'),
        departmentId: uid('department:bba'),
        name: 'Bachelor of Business Administration',
        code: 'BBA',
        status: 'ACTIVE',
      },
    ],
    'programs',
  );

  // ---------------------------------------------------------------- semesters
  await seedRows(
    manager,
    Semester,
    [
      {
        id: uid('semester:1'),
        programId: uid('program:cse'),
        name: 'Semester 1',
        semesterNumber: 1,
        status: 'ACTIVE',
      },
      {
        id: uid('semester:2'),
        programId: uid('program:cse'),
        name: 'Semester 2',
        semesterNumber: 2,
        status: 'ACTIVE',
      },
      {
        id: uid('semester:3'),
        programId: uid('program:eee'),
        name: 'Semester 1',
        semesterNumber: 1,
        status: 'ACTIVE',
      },
    ],
    'semesters',
  );

  // ---------------------------------------------------------- academic_sessions
  await seedRows(
    manager,
    AcademicSession,
    [
      {
        id: uid('session:2024'),
        name: '2024-25 Academic Session',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'ACTIVE',
      },
      {
        id: uid('session:2025'),
        name: '2025-26 Academic Session',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        status: 'ACTIVE',
      },
    ],
    'academic_sessions',
  );

  // ---------------------------------------------------------- student_institutes
  await seedRows(
    manager,
    StudentInstitute,
    [
      {
        id: uid('studentinst:student-1'),
        studentId: uid('user:student-1'),
        instituteId: uid('institute:du'),
        studentStatus: 'ACTIVE',
        enrollmentDate: '2021-02-01',
      },
      {
        id: uid('studentinst:student-2'),
        studentId: uid('user:student-2'),
        instituteId: uid('institute:buet'),
        studentStatus: 'ACTIVE',
        enrollmentDate: '2022-02-01',
      },
      {
        id: uid('studentinst:student-3'),
        studentId: uid('user:student-3'),
        instituteId: uid('institute:du'),
        studentStatus: 'ACTIVE',
        enrollmentDate: '2023-02-01',
      },
    ],
    'student_institutes',
  );

  // ------------------------------------------------------------- institute_agents
  await seedRows(
    manager,
    InstituteAgent,
    [
      {
        id: uid('instituteagent:1'),
        instituteId: uid('institute:du'),
        agentId: uid('agent:1'),
        assignedBy: uid('user:staff-1'),
        assignedAt: new Date('2026-01-05T10:00:00Z'),
        status: 'ACTIVE',
      },
      {
        id: uid('instituteagent:2'),
        instituteId: uid('institute:buet'),
        agentId: uid('agent:2'),
        assignedBy: uid('user:staff-1'),
        assignedAt: new Date('2026-01-06T10:00:00Z'),
        status: 'ACTIVE',
      },
    ],
    'institute_agents',
  );

  // ---------------------------------------------------------- institute_documents
  await seedRows(
    manager,
    InstituteDocument,
    [
      {
        id: uid('institutedoc:1'),
        instituteId: uid('institute:du'),
        documentName: 'Affiliation Certificate',
        documentType: 'CERTIFICATE',
        fileUrl: '/uploads/institutes/du-affiliation.pdf',
        uploadedBy: uid('user:staff-1'),
      },
      {
        id: uid('institutedoc:2'),
        instituteId: uid('institute:buet'),
        documentName: 'Registration Document',
        documentType: 'REGISTRATION',
        fileUrl: '/uploads/institutes/buet-registration.pdf',
        uploadedBy: uid('user:staff-1'),
      },
    ],
    'institute_documents',
  );

  void ctx;
}
