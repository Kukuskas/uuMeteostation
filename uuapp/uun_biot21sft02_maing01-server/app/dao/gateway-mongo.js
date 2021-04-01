"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;
const { convertToObjectId, convertArrayToIn } = require("./helpers/dao-common.js");

class GatewayMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, code: 1 }, { unique: true });
    await super.createIndex({ awid: 1, state: 1 });
    await super.createIndex({ awid: 1, uuEe: 1 });
  }

  async create(uuObject) {
    return await super.insertOne(this._prepareObject(uuObject));
  }

  async update(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.findOneAndUpdate(filter, this._prepareObject(uuObject), "NONE");
  }

  async get(awid, id) {
    const filter = { awid, id };
    return await super.findOne(filter);
  }

  async getByCode(awid, code) {
    const filter = { awid, code };
    return await super.findOne(filter);
  }

  async getByUuEe(awid, uuEe) {
    const filter = { awid, uuEe };
    return await super.findOne(filter);
  }

  async list(awid, pageInfo = {}) {
    const filter = { awid };
    return await super.find(filter, pageInfo);
  }

  async listByState(awid, state, pageInfo = {}) {
    state = convertArrayToIn(state);
    const filter = { awid, state };
    return await super.find(filter, pageInfo);
  }

  async delete(awid, id) {
    const filter = { awid, id };
    return await super.deleteOne(filter);
  }

  _prepareObject(uuObject) {
    return uuObject;
  }
}

module.exports = GatewayMongo;
