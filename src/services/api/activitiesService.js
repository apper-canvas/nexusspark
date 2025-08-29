import activitiesData from '@/services/mockData/activities.json';

class ActivitiesService {
  constructor() {
    // Load initial data or create empty array
    this.activities = [...activitiesData];
    this.nextId = Math.max(...this.activities.map(a => a.Id || a.id), 0) + 1;
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return copies to prevent mutation
    return this.activities.map(activity => ({
      Id: activity.Id || activity.id,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      status: activity.status,
      priority: activity.priority,
      dueDate: activity.dueDate,
      completedAt: activity.completedAt,
      contactId: activity.contactId,
      contactName: activity.contactName,
      dealId: activity.dealId,
      dealTitle: activity.dealTitle,
      assignedTo: activity.assignedTo,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
      outcome: activity.outcome
    }));
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const activity = this.activities.find(a => (a.Id || a.id) === parseInt(id));
    if (!activity) return null;
    
    return {
      Id: activity.Id || activity.id,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      status: activity.status,
      priority: activity.priority,
      dueDate: activity.dueDate,
      completedAt: activity.completedAt,
      contactId: activity.contactId,
      contactName: activity.contactName,
      dealId: activity.dealId,
      dealTitle: activity.dealTitle,
      assignedTo: activity.assignedTo,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
      outcome: activity.outcome
    };
  }

  async create(activityData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newActivity = {
      Id: this.nextId++,
      type: activityData.type,
      title: activityData.title.trim(),
      description: activityData.description?.trim() || '',
      status: activityData.status || 'pending',
      priority: activityData.priority || 'normal',
      dueDate: activityData.dueDate,
      completedAt: null,
      contactId: activityData.contactId || null,
      contactName: activityData.contactName || null,
      dealId: activityData.dealId || null,
      dealTitle: activityData.dealTitle || null,
      assignedTo: activityData.assignedTo || 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      outcome: null
    };
    
    this.activities.push(newActivity);
    return { ...newActivity };
  }

  async update(id, activityData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.activities.findIndex(a => (a.Id || a.id) === parseInt(id));
    if (index === -1) {
      throw new Error('Activity not found');
    }
    
    this.activities[index] = {
      ...this.activities[index],
      type: activityData.type || this.activities[index].type,
      title: activityData.title?.trim() || this.activities[index].title,
      description: activityData.description?.trim() ?? this.activities[index].description,
      priority: activityData.priority || this.activities[index].priority,
      dueDate: activityData.dueDate || this.activities[index].dueDate,
      contactId: activityData.contactId ?? this.activities[index].contactId,
      contactName: activityData.contactName ?? this.activities[index].contactName,
      dealId: activityData.dealId ?? this.activities[index].dealId,
      dealTitle: activityData.dealTitle ?? this.activities[index].dealTitle,
      assignedTo: activityData.assignedTo || this.activities[index].assignedTo,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.activities[index] };
  }

  async complete(id, outcome = '') {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.activities.findIndex(a => (a.Id || a.id) === parseInt(id));
    if (index === -1) {
      throw new Error('Activity not found');
    }
    
    this.activities[index] = {
      ...this.activities[index],
      status: 'completed',
      completedAt: new Date().toISOString(),
      outcome: outcome.trim() || 'Task completed successfully',
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.activities[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.activities.findIndex(a => (a.Id || a.id) === parseInt(id));
    if (index === -1) {
      throw new Error('Activity not found');
    }
    
    const deleted = this.activities.splice(index, 1)[0];
    return { ...deleted };
  }

  async getTasks() {
    const all = await this.getAll();
    return all.filter(activity => activity.status !== 'completed');
  }

  async getHistory() {
    const all = await this.getAll();
    return all
      .filter(activity => activity.status === 'completed')
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  }

  async getByContact(contactId) {
    const all = await this.getAll();
    return all.filter(activity => activity.contactId === parseInt(contactId));
  }

  async getByDeal(dealId) {
    const all = await this.getAll();
    return all.filter(activity => activity.dealId === parseInt(dealId));
  }

  async getOverdue() {
    const tasks = await this.getTasks();
    const now = new Date();
    return tasks.filter(task => task.dueDate && new Date(task.dueDate) < now);
  }
}

// Export singleton instance
export const activitiesService = new ActivitiesService();