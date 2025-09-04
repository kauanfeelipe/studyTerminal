/**
 * Lista de usuários autorizados a usar o StudyTerminal
 * IMPORTANTE: Edite esta lista para adicionar novos amigos
 */

export const ALLOWED_USERS = [
  // Adicione os emails dos seus amigos aqui
  'kauan@gmail.com',        // Substitua pelo seu email
  'maldszlopes@gmail.com',         // Email do amigo 1
  'gabriel@gmail.com',         // Email do amigo 2
  'clebersiberindia@gmail.com',         // Email do amigo 3
  // 'novos.amigos@email.com',  // Descomente e adicione novos amigos quando necessário
];

/**
 * Verifica se um email está na whitelist
 * @param {string} email - Email do usuário
 * @returns {boolean} - true se autorizado, false se não
 */
export const isUserAllowed = (email) => {
  if (!email) return false;
  
  // Converter para lowercase para comparação case-insensitive
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedAllowedUsers = ALLOWED_USERS.map(e => e.toLowerCase().trim());
  
  return normalizedAllowedUsers.includes(normalizedEmail);
};

/**
 * Obter lista de amigos autorizados (sem emails sensíveis)
 * Útil para logs ou debug
 */
export const getAllowedUsersCount = () => {
  return ALLOWED_USERS.length;
};

/**
 * Verificar se a whitelist está configurada
 */
export const isWhitelistConfigured = () => {
  return ALLOWED_USERS.length > 0 && !ALLOWED_USERS.includes('seu.email@gmail.com');
};
