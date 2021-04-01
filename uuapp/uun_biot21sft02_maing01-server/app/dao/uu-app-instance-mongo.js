"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class UuAppInstanceMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(this._prepareObject(uuObject));
  }


  async update(uuObject) {
    const filter = {
      awid: uuObject.awid
    };
    return await super.findOneAndUpdate(filter, this._prepareObject(uuObject), "NONE");
  }

  async getByAwid(awid) {
    const filter = { awid };
    return await super.findOne(filter);
  }

  _prepareObject(uuObject) {
    return uuObject;
  }
}

module.exports = UuAppInstanceMongo;
