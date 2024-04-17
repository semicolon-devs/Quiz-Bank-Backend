import { Injectable } from '@nestjs/common';
import { GoogleDriveService } from './common/services/google_drive/google_drive.service';

@Injectable()
export class AppService {
  constructor(private driveService: GoogleDriveService) {}

  getHello(): string {

    // TODO remove after testing is over
    this.driveService.addPermission(
      '1Sl5ktqpQZ5Jeav4W6aGNhehuFkmnYpfQ',
      'lasindua@gmail.com',
      'reader',
    );
    return 'Hello World!';
  }
}
