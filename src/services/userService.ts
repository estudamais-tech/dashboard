// src/services/userService.ts
import { API_BASE_URL } from '../config/apiConfig';

const userService = {
  // Função para buscar a contagem total de usuários
  async getTotalUsersCount(): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/count`);
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `HTTP error! Status: ${response.status}` };
        }
        console.error('Erro na API ao buscar contagem total de usuários:', response.status, errorData);
        throw new Error(errorData.message || 'Falha ao buscar a contagem de usuários da API.');
      }
      const data = await response.json();
      console.log('Contagem total de usuários recebida:', data.total_users);
      return data.total_users;
    } catch (error) {
      console.error('Erro em getTotalUsersCount:', error);
      throw error;
    }
  },

  // Função para buscar a contagem de usuários com GitHub
  async getGithubUsersCount(): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/github-count`);
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `HTTP error! Status: ${response.status}` };
        }
        console.error('Erro na API ao buscar contagem de usuários com GitHub:', response.status, errorData);
        throw new Error(errorData.message || 'Falha ao buscar a contagem de usuários com GitHub da API.');
      }
      const data = await response.json();
      console.log('Contagem de usuários com GitHub recebida:', data.github_users_count);
      return data.github_users_count;
    } catch (error) {
      console.error('Erro em getGithubUsersCount:', error);
      throw error;
    }
  },

  // Função para buscar a lista completa de estudantes
  async getAllStudents(): Promise<any[]> { // Use 'any[]' ou defina uma interface mais específica se souber a estrutura
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `HTTP error! Status: ${response.status}` };
        }
        console.error('Erro na API ao buscar lista de estudantes:', response.status, errorData);
        throw new Error(errorData.message || 'Falha ao carregar a lista de estudantes da API.');
      }
      const data = await response.json();
      console.log('Lista de estudantes recebida (raw data):', data);

      if (data && Array.isArray(data.students)) {
        console.log('Lista de estudantes extraída:', data.students);
        return data.students; // Retorna o array dentro da propriedade 'students'
      } else if (Array.isArray(data)) {
        console.log('Backend retornou array diretamente:', data);
        return data;
      } else {
        console.error('Formato de resposta inesperado para getAllStudents:', data);
        throw new Error('Formato de dados de estudantes inesperado do backend.');
      }

    } catch (error) {
      console.error('Erro em getAllStudents:', error);
      throw error;
    }
  },

  // Funções adicionais para as outras contagens (necessárias para o Students.tsx e Dashboard.tsx)
  async getStudentsWithActiveBenefitsCount(): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/active-benefits-count`);
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `HTTP error! Status: ${response.status}` };
        }
        console.error('Erro na API ao buscar contagem de usuários com benefícios ativos:', response.status, errorData);
        throw new Error(errorData.message || 'Falha ao buscar a contagem de usuários com benefícios ativos da API.');
      }
      const data = await response.json();
      console.log('Contagem de usuários com benefícios ativos recebida:', data.active_benefits_count);
      return data.active_benefits_count;
    } catch (error) {
      console.error('Erro em getStudentsWithActiveBenefitsCount:', error);
      throw error;
    }
  },

  async getPendingStudentsCount(): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/pending-github-count`);
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `HTTP error! Status: ${response.status}` };
        }
        console.error('Erro na API ao buscar contagem de usuários pendentes:', response.status, errorData);
        throw new Error(errorData.message || 'Falha ao buscar a contagem de usuários pendentes da API.');
      }
      const data = await response.json();
      console.log('Contagem de usuários pendentes recebida:', data.pending_students_count);
      return data.pending_students_count;
    } catch (error) {
      console.error('Erro em getPendingStudentsCount:', error);
      throw error;
    }
  },

  // --- NOVAS FUNÇÕES PARA A DASHBOARD DO ESTUDANTE ---

  // Função para salvar os dados de onboarding do estudante
  async saveOnboardingData(onboardingData: { course: string; currentSemester: number; totalSemesters: number; areasOfInterest: string[]; }): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/onboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // ADICIONADO: Incluir credenciais para enviar o cookie de autenticação
          'Accept': 'application/json'
        },
        body: JSON.stringify(onboardingData),
        credentials: 'include', // ADICIONADO: Enviar cookies com a requisição
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `HTTP error! Status: ${response.status}` };
        }
        console.error('Erro na API ao salvar dados de onboarding:', response.status, errorData);
        throw new Error(errorData.message || 'Falha ao salvar dados de onboarding.');
      }
      const data = await response.json();
      console.log('Dados de onboarding salvos com sucesso:', data);
      return data;
    } catch (error) {
      console.error('Erro em saveOnboardingData:', error);
      throw error;
    }
  },

  // Função para buscar os dados específicos da dashboard do estudante logado
  async getStudentDashboardData(): Promise<any> { // Use 'any' ou a interface StudentData definida no StudentDashboard.tsx
    try {
      // REMOVIDO: Dados mockados
      const response = await fetch(`${API_BASE_URL}/student/dashboard`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include', // ADICIONADO: Enviar cookies com a requisição
      });
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `HTTP error! Status: ${response.status}` };
        }
        console.error('Erro na API ao buscar dados da dashboard do estudante:', response.status, errorData);
        throw new Error(errorData.message || 'Falha ao buscar dados da dashboard do estudante.');
      }
      const data = await response.json();
      console.log('Dados da dashboard do estudante recebidos:', data);
      return data;
    } catch (error) {
      console.error('Erro em getStudentDashboardData:', error);
      throw error;
    }
  },

  // Função para atualizar o status de um benefício (resgatado/não resgatado)
  async updateBenefitStatus(productId: string, isRedeemed: boolean, monthlyValueUSD: number, monthsRemaining: number): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/student/benefits/${productId}`, {
        method: 'PUT', // Ou PATCH, dependendo da sua API
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ isRedeemed, monthlyValueUSD, monthsRemaining }), // ADICIONADO: monthlyValueUSD e monthsRemaining
        credentials: 'include', // ADICIONADO: Enviar cookies com a requisição
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `HTTP error! Status: ${response.status}` };
        }
        console.error('Erro na API ao atualizar status do benefício:', response.status, errorData);
        throw new Error(errorData.message || 'Falha ao atualizar status do benefício.');
      }
      const data = await response.json();
      console.log('Status do benefício atualizado com sucesso:', data);
      return data;
    } catch (error) {
      console.error('Erro em updateBenefitStatus:', error);
      throw error;
    }
  },
};

export default userService;
// correto