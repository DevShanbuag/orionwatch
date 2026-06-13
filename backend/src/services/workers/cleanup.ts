export class CleanupWorker {
  async cleanupOldData(daysOld: number = 30): Promise<void> {
    // Stub for cleaning up old threats/incidents
    console.log(`Cleaning up data older than ${daysOld} days`);
  }
}
