export default {
  translations: {
    common: {
      actions: 'Actions',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirmDelete: 'Confirm deletion',
      success: 'Success',
      empty: 'No records found',
      theme: {
        light: 'Switch to dark theme',
        dark: 'Switch to light theme'
      }
    },
    app: {
      title: 'Student Manager',
      description: 'Student Management'
    },
    students: {
      list: {
        title: 'Students List',
        empty: 'No students registered',
        name: 'Name',
        age: 'Age',
        years: 'years',
        count_one: '{{count}} student registered',
        count_other: '{{count}} students registered'
      },
      form: {
        title: 'Register New Student',
        name: {
          label: 'Student Name',
          placeholder: 'Enter student name'
        },
        age: {
          label: 'Age',
          placeholder: 'Enter age'
        },
        submit: 'Register',
        save: 'Save',
        successMessage: 'Student successfully registered!'
      },
      edit: {
        title: 'Edit Student',
        successMessage: 'Student successfully updated!'
      },
      delete: {
        confirm: 'Do you really want to delete the student {{name}}?',
        successMessage: 'Student successfully deleted!'
      }
    }
  }
} 