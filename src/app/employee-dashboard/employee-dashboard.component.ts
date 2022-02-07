import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { ApiService } from '../shared/api.service'
import { EmployeeModel } from './employee-dashboard.model'

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css'],
})
export class EmployeeDashboardComponent implements OnInit {
  formValue!: FormGroup
  employeeModelObj: EmployeeModel = new EmployeeModel()
  employeeData!: any
  isEdit: boolean = false
  isLogin: boolean = localStorage.getItem('user') ? true : false

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      salary: [''],
    })

    this.getAllEmployee()
  }

  postEmployeeDetails() {
    this.employeeModelObj.firstName = this.formValue.value.firstName
    this.employeeModelObj.lastName = this.formValue.value.lastName
    this.employeeModelObj.email = this.formValue.value.email
    this.employeeModelObj.mobile = this.formValue.value.mobile
    this.employeeModelObj.salary = this.formValue.value.salary

    this.api.postEmployee(this.employeeModelObj).subscribe(
      (res) => {
        alert('Employee Added Successfully')
        let ref = document.getElementById('cancel') // Close button id="cancel"
        ref?.click() // click event for close button
        this.formValue.reset() // this method clear form values
        this.getAllEmployee()
      },
      (err) => {
        alert('Something went wrong')
      },
    )
  }

  logout() {
    this.router.navigate(['/login'])
    localStorage.clear()
  }

  resetForm() {
    this.formValue.reset()
  }
  getAllEmployee() {
    this.api.getEmployee().subscribe((res) => {
      this.employeeData = res
    })
  }

  deleteEmployee(row: any) {
    this.api.deleteEmployee(row.id).subscribe((res) => {
      alert('Employee Deleted Successfully')
      this.getAllEmployee()
    })
  }

  onEdit(row: any) {
    this.employeeModelObj.id = row.id
    this.formValue.controls['firstName'].setValue(row.firstName)
    this.formValue.controls['lastName'].setValue(row.lastName)
    this.formValue.controls['email'].setValue(row.email)
    this.formValue.controls['mobile'].setValue(row.mobile)
    this.formValue.controls['salary'].setValue(row.salary)
    this.isEdit = true
  }

  updateEmployeeDetails() {
    this.employeeModelObj.firstName = this.formValue.value.firstName
    this.employeeModelObj.lastName = this.formValue.value.lastName
    this.employeeModelObj.email = this.formValue.value.email
    this.employeeModelObj.mobile = this.formValue.value.mobile
    this.employeeModelObj.salary = this.formValue.value.salary

    this.api
      .updateEmployee(this.employeeModelObj, this.employeeModelObj.id)
      .subscribe((res) => {
        alert('Employee Updated Successfully')
        let ref = document.getElementById('cancel') // Close button id="cancel"
        ref?.click() // click event for close button
        this.formValue.reset() // this method clear form values
        this.getAllEmployee()
      })
  }
}
