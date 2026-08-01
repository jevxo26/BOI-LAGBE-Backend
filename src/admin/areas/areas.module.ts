import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import {
  Area,
  Country,
  Division,
  District,
  Upazila,
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
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Area,
      Country,
      Division,
      District,
      Upazila,
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
    ]),
  ],
  controllers: [AreasController],
  providers: [AreasService],
  exports: [AreasService],
})
export class AreasModule {}
