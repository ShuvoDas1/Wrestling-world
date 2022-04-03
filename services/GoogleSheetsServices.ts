const { GoogleSpreadsheet } = require("google-spreadsheet");

class GoogleSheetServices {
  private doc: any;

  constructor() {
    this.doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
    this.authenticate();
  }

  private async authenticate() {
    await this.doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    });
  }

  public async getSpreadSheetData() {
    await this.doc.loadInfo();
    const specialEventsSheet = this.doc.sheetsByIndex[0];
    const videoYoutubeIdsSheet = this.doc.sheetsByIndex[1];

    const specialEventsRows = await specialEventsSheet.getRows();
    const videoYoutubeIdsRows = await videoYoutubeIdsSheet.getRows();

    const specialEvents: Array<any> = specialEventsRows.map((row: any) => row._rawData[0]);
    const youtubeVideoIds: Array<any> = videoYoutubeIdsRows.map((row: any) => row._rawData[0]);

    return { specialEvents, youtubeVideoIds };
  }
}

export default new GoogleSheetServices();
