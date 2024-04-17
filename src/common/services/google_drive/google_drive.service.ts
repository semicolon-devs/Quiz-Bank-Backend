import { Injectable } from '@nestjs/common';
import { drive_v3, google } from 'googleapis';
import * as fs from 'fs';

@Injectable()
export class GoogleDriveService {
  private drive: drive_v3.Drive;

  constructor() {
    // Load credentials from the JSON key file
    const credentials = JSON.parse(
      fs.readFileSync(
        process.env.DRIVE_CREDENTIALS_PATH,
        'utf8',
      ),
    );

    // Authenticate with the Drive API using your credentials
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    // Initialize Google Drive API client
    this.drive = google.drive({
      version: 'v3',
      auth: auth,
    });
  }

  async addPermission(folderId: string, emailAddress: string, role: string) {
    try {
      const permission = await this.drive.permissions.create({
        fileId: folderId,
        requestBody: {
          role: role,
          type: 'user',
          emailAddress: emailAddress,
        },
      });
      console.log('Permission added: ', permission.data);
      return permission.data;
    } catch (error) {
      console.error('Error adding permission: ', error);
      throw error;
    }
  }
}
