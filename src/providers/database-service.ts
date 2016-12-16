import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite } from 'ionic-native';

export class Deployments {
  static Table : string = 'deployments';
  static Columns : any = {
    'id': 'INTEGER PRIMARY KEY AUTOINCREMENT',
    'url': 'TEXT',
    'name': 'TEXT',
    'domain': 'TEXT',
    'subdomain': 'TEXT',
    'status': 'TEXT',
    'description': 'TEXT',
    'image': 'TEXT',
    'username': 'TEXT',
    'password': 'TEXT',
    'access_token': 'TEXT',
    'refresh_token': 'TEXT'};
}

export class Posts {
  static Table : string = 'posts';
  static Columns : any = {
    'id': 'INTEGER PRIMARY KEY AUTOINCREMENT',
    'deployment': 'INTEGER',
    'title': 'TEXT',
    'content': 'TEXT',
    'slug': 'TEXT',
    'type': 'TEXT',
    'status': 'TEXT',
    'color': 'TEXT',
    'message': 'TEXT',
    'created': 'TEXT',
    'updated': 'TEXT',
    'image': 'TEXT',
    'pending': 'INTEGER',
    'latitude': 'DOUBLE',
    'longitude': 'DOUBLE'};
}

export class Forms {
  static Table : string = 'forms';
  static Columns : any = {
    'id': 'INTEGER PRIMARY KEY AUTOINCREMENT',
    'deployment': 'INTEGER',
    'name': 'TEXT',
    'description': 'TEXT',
    'type': 'TEXT',
    'color': 'TEXT',
    'disabled': 'INTEGER',
    'require_approval': 'INTEGER',
    'everyone_can_create': 'INTEGER',
    'created': 'TEXT',
    'updated': 'TEXT'};
}

export class Attributes {
  static Table : string = 'attributes';
  static Columns : any = {
    'id': 'INTEGER PRIMARY KEY AUTOINCREMENT',
    'deployment': 'INTEGER',
    'form': 'INTEGER',
    'key': 'TEXT',
    'label': 'TEXT',
    'instructions': 'TEXT',
    'input': 'TEXT',
    'type': 'TEXT',
    'required': 'INTEGER',
    'priority': 'INTEGER',
    'cardinality': 'INTEGER',
    'options': 'TEXT'};
}

@Injectable()
export class DatabaseService {

  name: string;
  location: string;
  database : SQLite;
  tables : any = {};

  constructor(public platform:Platform) {
    this.name = 'ushahidi.db';
    this.location = 'default';
    this.database = null;
    this.tables[Deployments.Table] = Deployments.Columns;
    this.tables[Posts.Table] = Posts.Columns;
    this.tables[Forms.Table] = Forms.Columns;
    this.tables[Attributes.Table] = Attributes.Columns;
  }

  testDatabase() {
    return this.platform.platforms().indexOf('cordova') >= 0;
  }

  openDatabase() {
    console.log("Database openDatabase");
    return new Promise((resolve, reject) => {
      if (this.database) {
        console.log(`Database Cached ${JSON.stringify(this.database)}`);
        resolve(this.database);
      }
      else if (this.testDatabase()) {
        let database = new SQLite();
        database.openDatabase({
          name: this.name,
          location: this.location
        }).then(
          () => {
            console.log(`Database Opened ${JSON.stringify(database)}`);
            this.database = database;
            resolve(database);
          },
          (error) => {
            console.error(`Database Open Failed ${JSON.stringify(error)}`);
            reject(JSON.stringify(error));
          });
      }
      else {
        console.error(`Database Open Failed Cordova Not Available`);
        reject(`Error Opening Database`);
      }
    });
  }

  createTables() {
    console.log(`Database createTables`);
    return new Promise((resolve, reject) => {
      this.openDatabase().then((database:SQLite) => {
        for (var table in this.tables) {
          let columns = []
          let values = this.tables[table];
          for (var value in values) {
            columns.push(value + ' ' + values[value]);
          }
          let sql = `CREATE TABLE IF NOT EXISTS ${table} (${columns.join(", ")})`;
          console.log(`Database Creating ${sql}`);
          database.executeSql(sql, []).then(
            (data) => {
              console.log(`Database Created ${sql} ${JSON.stringify(data)}`);
              resolve(true);
            },
            (error) => {
              console.error(`Database Create Failed ${sql} ${JSON.stringify(error)}`);
              reject(JSON.stringify(error));
            });
        }
      },
      (error) => {
        console.error(`Database Create Failed ${error}`);
        reject(`Error Creating Database Tables`);
      });
    });
  }

  addDeployment(data:{}) {
    console.log(`Database addDeployment ${JSON.stringify(data)}`);
    data['name'] = data['deployment_name'];
    data['url'] = `https://${data['subdomain']}.${data['domain']}`;
    return this.executeInsert(Deployments.Table, data);
  }

  updateDeployment(id:string, data:{}) {
    return this.executeUpdate(Deployments.Table, id, data);
  }

  removeDeployment(id:string) {
    return this.executeDelete(Deployments.Table, {
      "id": id });
  }

  getDeploymentBySubdomain(subdomain:string) {
    return this.executeSelect(Deployments.Table, {
      "subdomain": subdomain });
  }
  getDeployments() {
    return this.executeSelect(Deployments.Table);
  }

  getDeployment(id:number) {
    return this.executeSelect(Deployments.Table, {
      "id": id });
  }

  getPosts(deployment:number) {
    return this.executeSelect(Posts.Table, {
      "deployment": deployment });
  }

  getPost(deployment:number, post:number) {
    return this.executeSelect(Posts.Table, {
      "deployment": deployment,
      "id": post });
  }

  addPost(deployment:number, data:{}) {
    console.log(`Database addPost Deployment ${deployment} ${JSON.stringify(data)}`);
    data['deployment'] = deployment;
    if (data['values']['location_default']) {
      let location = data['values']['location_default'][0];
      data['latitude'] = location['lat'];
      data['longitude'] = location['lon'];
    }
    return Promise.all([
      this.executeUpdate(Posts.Table, data['id'], data),
      this.executeInsert(Posts.Table, data)]);
  }

  removePosts(deployment:string) {
    return this.executeDelete(Posts.Table, {
      "deployment": deployment });
  }

  getForms(deployment:number) {
    return this.executeSelect(Forms.Table, {
      "deployment": deployment });
  }

  getForm(deployment:number, form:number) {
    return this.executeSelect(Forms.Table, {
      "deployment": deployment,
      "id": form });
  }

  addForm(deployment:number, data:{}) {
    console.log(`Database addForm Deployment ${deployment} ${JSON.stringify(data)}`);
    data['deployment'] = deployment;
    return Promise.all([
      this.executeUpdate(Forms.Table, data['id'], data),
      this.executeInsert(Forms.Table, data)]);
  }

  removeForms(deployment:string) {
    return this.executeDelete(Forms.Table, {
      "deployment": deployment });
  }

  addAttribute(deployment:number, data:{}) {
    console.log(`Database addAttribute Deployment ${deployment} ${JSON.stringify(data)}`);
    data['deployment'] = deployment;
    data['form'] = data['form_stage_id'];
    return Promise.all([
      this.executeUpdate(Attributes.Table, data['id'], data),
      this.executeInsert(Attributes.Table, data)]);
  }

  getAttributes(deployment:number, form:number) {
    return this.executeSelect(Attributes.Table,
      { "deployment": deployment,
        "form": form },
      { "cardinality": 'ASC' });
  }

  removeAttributes(deployment:string) {
    return this.executeDelete(Attributes.Table, {
      "deployment": deployment });
  }

  executeFirst(table:string, where:{}=null, order:{}=null) {
    return new Promise((resolve, reject) => {
      this.executeSelect(table, where, order).then(rows => {
        let results = <any[]>rows;
        if (results && results.length > 0) {
          resolve(results[0]);
        }
        else {
          reject();
        }
      });
    });
  }

  executeSelect(table:string, where:{}=null, order:{}=null) {
    return new Promise((resolve, reject) => {
      this.openDatabase().then((database:SQLite) => {
        let query = [`SELECT * FROM ${table}`];
        if (where != null) {
          let clause = [];
          for (let column in where) {
            clause.push(`${column} = '${where[column]}'`);
          }
          query.push(`WHERE ${clause.join(' AND ')}`);
        }
        if (order != null) {
          let sort = [];
          for (let column in order) {
            sort.push(`${column} ${order[column]}`);
          }
          query.push(`ORDER BY ${sort.join(', ')}`);
        }
        let sql = query.join(" ");
        console.log(`Database Selecting ${sql}`);
        database.executeSql(sql, []).then(
          (data) => {
            if (data.rows.length > 0) {
              let results = [];
              let columns = this.tables[table];
              for (let i = 0; i < data.rows.length; i++) {
                let row = data.rows.item(i);
                let result = {};
                for (var column in columns) {
                  if (row[column]) {
                    result[column] = row[column];
                  }
                }
                results.push(result);
              }
              console.log(`Database Selected ${sql} ${JSON.stringify(results)}`);
              resolve(results);
            }
            else {
              console.log(`Database Selected ${sql} []`);
              resolve([]);
            }
          },
          (error) => {
            console.error(`Database Select Failed ${JSON.stringify(error)}`);
            reject(JSON.stringify(error));
          });
      },
      (error) => {
        console.error(`Database Select Failed ${error}`);
        reject(error);
      });
    });
  }

  executeInsert(table:string, data:{}) {
    return new Promise((resolve, reject) => {
      this.openDatabase().then((database:SQLite) => {
        let columns = this.tables[table];
        let statement = this.insertStatement(table, columns, data);
        let parameters = this.insertParameters(table, columns, data);
        console.log(`Database Inserting ${statement} ${parameters}`);
        database.executeSql(statement, parameters).then(
          (results) => {
            console.log(`Database Inserted ${statement} ${parameters} ${JSON.stringify(results)}`);
            resolve(results['insertId']);
          },
          (error) => {
            console.error(`Database Insert Failed ${statement} ${parameters} ${JSON.stringify(error)}`);
            reject(JSON.stringify(error));
          });
      },
      (error) => {
        console.error(`Database Insert Failed ${error}`);
        reject(JSON.stringify(error));
      });
    });
  }

  executeUpdate(table:string, id:string, data:{}) {
    return new Promise((resolve, reject) => {
      this.openDatabase().then((database:SQLite) => {
        let columns = this.tables[table];
        let statement = this.updateStatement(table, columns, id, data);
        let parameters = this.updateParameters(table, columns, id, data);
        console.log(`Database Updating ${statement} ${parameters}`);
        database.executeSql(statement, parameters).then(
          (results) => {
            console.log(`Database Updated ${statement} ${parameters} ${JSON.stringify(results)}`);
            resolve(true);
          },
          (error) => {
            console.error(`Database Update Failed ${statement} ${parameters} ${JSON.stringify(error)}`);
            reject(JSON.stringify(error));
          });
      },
      (error) => {
        console.error(`Database Update Failed ${error}`);
        reject(JSON.stringify(error));
      });
    });
  }

  executeDelete(table:string, data:{}) {
    return new Promise((resolve, reject) => {
      this.openDatabase().then((database:SQLite) => {
        let statement = this.deleteStatement(table, data);
        console.log(`Database Deleting ${statement}`);
        database.executeSql(statement, []).then(
          (results) => {
            console.log(`Database Deleted ${statement} ${JSON.stringify(results)}`);
            resolve(results['insertId']);
          },
          (error) => {
            console.error(`Database Delete Failed ${statement} ${JSON.stringify(error)}`);
            reject(JSON.stringify(error));
          });
      },
      (error) => {
        console.error(`Database Delete Failed ${error}`);
        reject(JSON.stringify(error));
      });
    });
  }

  deleteStatement(table:string, data:{}) : string {
    let clause = [];
    for (var column in data) {
      clause.push(`${column} = '${data[column]}'`);
    }
    return `DELETE FROM ${table} WHERE ${clause.join(' AND ')}`;
  }

  insertStatement(table:string, columns, values) : string {
    let names = [];
    let params = [];
    for (var column in columns) {
      if (values[column]) {
        names.push(column);
        params.push("?");
      }
    }
    return `INSERT OR IGNORE INTO ${table} (${names.join(", ")}) VALUES (${params.join(", ")})`;
  }

  insertParameters(table:string, columns:{}, values:{}) : any {
    let params = [];
    for (var column in columns) {
      if (values[column]) {
        let type = columns[column];
        if (type == 'TEXT') {
          params.push(values[column].toString());
        }
        else {
          params.push(values[column]);
        }
      }
    }
    return params;
  }

  updateStatement(table:string, columns:{}, id:string, values:{}) : string {
    let params = [];
    for (var column in columns) {
      if (values[column]) {
        params.push(`${column} = ?`);
      }
    }
    return `UPDATE OR IGNORE ${table} SET ${params.join(", ")} WHERE id = ${id}`;
  }

  updateParameters(table:string, columns:{}, id:string, values:{}) : any {
    let params = [];
    for (var column in columns) {
      if (values[column]) {
        let type = columns[column];
        if (type == 'TEXT') {
          params.push(values[column].toString());
        }
        else {
          params.push(values[column]);
        }
      }
    }
    return params;
  }

}
