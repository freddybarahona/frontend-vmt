import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SubjectService } from '../../services/subject.service';
import { Subject } from '../../interfaces/subject';

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class UserDashboardComponent implements OnInit {

  private subjectService = inject(SubjectService);

  subjects: Subject[] = [];

  ngOnInit(): void {

    const studentId = 34;

    this.subjectService
      .getSubjectsByStudent(studentId)
      .subscribe({
        next: (data) => {
          this.subjects = data;
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
}
