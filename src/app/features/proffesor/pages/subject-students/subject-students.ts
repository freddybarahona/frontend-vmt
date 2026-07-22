import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subject-students',
  imports: [],
  templateUrl: './subject-students.html',
  styleUrl: './subject-students.css',
})
export class SubjectStudents implements OnInit {
  private route = inject(ActivatedRoute)
  
  ngOnInit(): void {
    const subjectId = Number(this.route.snapshot.paramMap.get('subjectId'))
    console.log(subjectId)
  }

}
