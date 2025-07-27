export default {
  translations: {
    common: {
      actions: 'Ações',
      save: 'Salvar',
      cancel: 'Cancelar',
      delete: 'Deletar',
      edit: 'Editar',
      confirmDelete: 'Confirmar exclusão',
      success: 'Sucesso',
      empty: 'Nenhum registro encontrado',
      theme: {
        light: 'Mudar para tema escuro',
        dark: 'Mudar para tema claro'
      }
    },
    app: {
      title: 'Student Manager',
      description: 'Gerenciamento de alunos'
    },
    students: {
      list: {
        title: 'Lista de Alunos',
        empty: 'Nenhum aluno cadastrado',
        name: 'Nome',
        age: 'Idade',
        years: 'anos',
        count_one: '{{count}} aluno cadastrado',
        count_other: '{{count}} alunos cadastrados'
      },
      form: {
        title: 'Cadastrar Novo Aluno',
        name: {
          label: 'Nome do Aluno',
          placeholder: 'Digite o nome do aluno'
        },
        age: {
          label: 'Idade',
          placeholder: 'Digite a idade'
        },
        submit: 'Cadastrar',
        save: 'Salvar',
        successMessage: 'Aluno cadastrado com sucesso!'
      },
      edit: {
        title: 'Editar Aluno',
        successMessage: 'Aluno atualizado com sucesso!'
      },
      delete: {
        confirm: 'Deseja realmente excluir o aluno {{name}}?'
      }
    }
  }
} 