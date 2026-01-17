/**
 * 定时任务调度器
 * 负责管理和执行定时同步任务
 */

import { dailySyncTask } from './qianchuanSyncService';

interface ScheduledTask {
  name: string;
  cronExpression: string;
  handler: () => Promise<void>;
  lastRun?: Date;
  nextRun?: Date;
  enabled: boolean;
}

class TaskScheduler {
  private tasks: Map<string, ScheduledTask> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private isRunning: boolean = false;

  /**
   * 注册定时任务
   */
  registerTask(task: ScheduledTask) {
    this.tasks.set(task.name, task);
    console.log(`[Scheduler] Task registered: ${task.name}`);
  }

  /**
   * 启动调度器
   */
  start() {
    if (this.isRunning) {
      console.log('[Scheduler] Already running');
      return;
    }

    this.isRunning = true;
    console.log('[Scheduler] Starting scheduler...');

    // 为每个任务设置定时器
    this.tasks.forEach((task, name) => {
      if (task.enabled) {
        this.scheduleTask(name, task);
      }
    });

    console.log('[Scheduler] Scheduler started');
  }

  /**
   * 停止调度器
   */
  stop() {
    this.isRunning = false;
    
    // 清除所有定时器
    this.timers.forEach((timer, name) => {
      clearTimeout(timer);
      console.log(`[Scheduler] Timer cleared: ${name}`);
    });
    this.timers.clear();

    console.log('[Scheduler] Scheduler stopped');
  }

  /**
   * 调度单个任务
   */
  private scheduleTask(name: string, task: ScheduledTask) {
    const nextRunTime = this.calculateNextRun(task.cronExpression);
    task.nextRun = nextRunTime;

    const delay = nextRunTime.getTime() - Date.now();
    
    console.log(`[Scheduler] Task ${name} scheduled for ${nextRunTime.toISOString()} (in ${Math.round(delay / 1000 / 60)} minutes)`);

    const timer = setTimeout(async () => {
      if (!this.isRunning) return;

      console.log(`[Scheduler] Executing task: ${name}`);
      task.lastRun = new Date();

      try {
        await task.handler();
        console.log(`[Scheduler] Task ${name} completed successfully`);
      } catch (error) {
        console.error(`[Scheduler] Task ${name} failed:`, error);
      }

      // 重新调度下一次执行
      if (this.isRunning && task.enabled) {
        this.scheduleTask(name, task);
      }
    }, delay);

    this.timers.set(name, timer);
  }

  /**
   * 解析cron表达式并计算下次执行时间
   * 简化版本：仅支持 "HH:MM" 格式的每日执行
   */
  private calculateNextRun(cronExpression: string): Date {
    // 解析 "0 2 * * *" 格式（分钟 小时 日 月 星期）
    const parts = cronExpression.split(' ');
    const minute = parseInt(parts[0]) || 0;
    const hour = parseInt(parts[1]) || 2; // 默认凌晨2点

    const now = new Date();
    const nextRun = new Date();
    
    nextRun.setHours(hour, minute, 0, 0);

    // 如果今天的执行时间已过，则设置为明天
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    return nextRun;
  }

  /**
   * 手动触发任务
   */
  async triggerTask(name: string): Promise<boolean> {
    const task = this.tasks.get(name);
    if (!task) {
      console.error(`[Scheduler] Task not found: ${name}`);
      return false;
    }

    console.log(`[Scheduler] Manually triggering task: ${name}`);
    task.lastRun = new Date();

    try {
      await task.handler();
      console.log(`[Scheduler] Task ${name} completed successfully`);
      return true;
    } catch (error) {
      console.error(`[Scheduler] Task ${name} failed:`, error);
      return false;
    }
  }

  /**
   * 获取任务状态
   */
  getTaskStatus(name: string) {
    const task = this.tasks.get(name);
    if (!task) return null;

    return {
      name: task.name,
      cronExpression: task.cronExpression,
      enabled: task.enabled,
      lastRun: task.lastRun,
      nextRun: task.nextRun,
    };
  }

  /**
   * 获取所有任务状态
   */
  getAllTaskStatus() {
    const statuses: Array<{
      name: string;
      cronExpression: string;
      enabled: boolean;
      lastRun?: Date;
      nextRun?: Date;
    }> = [];
    this.tasks.forEach((task, name) => {
      statuses.push({
        name: task.name,
        cronExpression: task.cronExpression,
        enabled: task.enabled,
        lastRun: task.lastRun,
        nextRun: task.nextRun,
      });
    });
    return statuses;
  }

  /**
   * 启用/禁用任务
   */
  setTaskEnabled(name: string, enabled: boolean) {
    const task = this.tasks.get(name);
    if (!task) return false;

    task.enabled = enabled;

    if (enabled && this.isRunning) {
      this.scheduleTask(name, task);
    } else if (!enabled) {
      const timer = this.timers.get(name);
      if (timer) {
        clearTimeout(timer);
        this.timers.delete(name);
      }
    }

    return true;
  }
}

// 创建全局调度器实例
export const scheduler = new TaskScheduler();

// 注册千川每日同步任务
scheduler.registerTask({
  name: 'qianchuan_daily_sync',
  cronExpression: '0 2 * * *', // 每天凌晨2点执行
  handler: async () => {
    const result = await dailySyncTask();
    if (!result.success) {
      throw new Error(result.message);
    }
  },
  enabled: true,
});

/**
 * 初始化调度器（在服务器启动时调用）
 */
export function initScheduler() {
  console.log('[Scheduler] Initializing scheduler...');
  scheduler.start();
}

/**
 * 停止调度器（在服务器关闭时调用）
 */
export function stopScheduler() {
  scheduler.stop();
}
