<template>
    <div style="min-height: 600px;">
      <v-data-table
        :headers="headers"
        :items="times"
        :sort-by="[{ key: 'id', order: 'asc' }]"
        fixed-header
        hover="true"
        class="div-center"
      >
  
        <template v-slot:top>
          <v-toolbar>
            <v-toolbar-title>Times</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <v-spacer></v-spacer>

            <v-dialog
              v-model="dialog"
              max-width="50%"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  class="mb-2"
                  variant="elevated"
                  color="primary"
                  dark
                  v-bind="props"
                >
                  Adicionar Time
                </v-btn>
              </template>

              <div>
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">Adicionar Time</span>
                    </v-card-title>
        
                    <!-- Formulario de add/editar o time -->
                    <v-card-text>
                        <v-container>
                        <v-row justify="center">
                          <v-col
                            cols="18"
                            md="14"
                            sm="10"
                          >
                            <v-text-field
                              v-model="editedItem.nomeTime"
                              label="Nome do Time"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
        
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="red-darken-1"
                        variant="text"
                        @click="close"
                      >
                        Cancelar
                      </v-btn>
                      <v-btn
                        color="green-darken-1"
                        variant="text"
                        @click="save"
                      >
                        Salvar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
              </div>
            </v-dialog>
  
            <v-dialog v-model="dialogDelete" max-width="600px">
              <v-card>
                <v-card-title class="text-button text-center">Tem certeza que deseja excluir este time?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
                  <v-btn color="green-darken-1" variant="text" @click="deleteTeamConfirm">Confirmar</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>

          <!-- Dialogo de SHOW do Time -->
          <v-dialog
              v-model="show"
              max-width="80%"
            >

              <div>
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">Informações do Time</span>
                    </v-card-title>
        
                    <v-card-text>
                        <v-container>
                        <v-row>
                          <v-col
                            cols="12"
                            md="4"
                            sm="6"
                          >
                            <v-text-field
                              v-model="editedItem.nomeTime"
                              label="Nome do Time"
                              :rules="[required]"
                              readonly
                            ></v-text-field>
                          </v-col>

                          <v-col
                            cols="12"
                            md="4"
                            sm="6"
                          >
                          <v-card
                            class="mx-auto"
                            max-width="300">

                            <v-list-subheader >Profissionais</v-list-subheader>
                            <v-list :items="this.profsTime" variant="tonal" bg-color="#383131">
                            </v-list>
                        </v-card>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
        
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue-darken-1"
                        variant="text"
                        @click="close"
                      >
                        Fechar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
              </div>
            </v-dialog>

            <v-dialog
              v-model="add"
              max-width="80%"
            >
              <div>
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">Adicionar um profissional</span>
                    </v-card-title>
        
                    <v-card-text>
                        <v-container>
                        <v-row>
                          <v-col
                            cols="12"
                            md="4"
                            sm="6"
                          >
                            <v-text-field
                              v-model="editedItem.nomeTime"
                              label="Nome do Time"
                              readonly
                            ></v-text-field>
                          </v-col>

                          <v-col
                            cols="12"
                            md="4"
                            sm="6"
                          >
                          <v-select 
                            v-model="newProf"
                            label="Selecione um profissional"
                            :items="nomesProf"
                            ></v-select>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
        
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="red-darken-1"
                        variant="text"
                        @click="close"
                      >
                        Cancelar
                      </v-btn>
                      <v-btn
                        color="green-darken-1"
                        variant="text"
                        @click="save"
                      >
                        Adicionar
                      </v-btn>
                      
                    </v-card-actions>
                  </v-card>
              </div>
            </v-dialog>


            <v-dialog
              v-model="rem"
              max-width="80%"
            >
              <div>
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">Remover um profissional</span>
                    </v-card-title>
        
                    <v-card-text>
                        <v-container>
                        <v-row>
                          <v-col
                            cols="12"
                            md="4"
                            sm="6"
                          >
                            <v-text-field
                              v-model="editedItem.nomeTime"
                              label="Nome do Time"
                              readonly
                            ></v-text-field>
                          </v-col>

                          <v-col
                            cols="12"
                            md="4"
                            sm="6"
                          >
                          <v-select 
                            v-model="newProf"
                            label="Selecione um profissional"
                            :items="profsTime"
                            ></v-select>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
        
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="red-darken-1"
                        variant="text"
                        @click="close"
                      >
                        Cancelar
                      </v-btn>
                      <v-btn
                        color="green-darken-1"
                        variant="text"
                        @click="save"
                      >
                        Remover
                      </v-btn>
                      
                    </v-card-actions>
                  </v-card>
              </div>
            </v-dialog>


        </template>
        
        <template v-slot:item.actions="{ item }">
            <div>
                <v-icon
                  class="me-2"
                  size="small"
                  @click="addProf(item)"
                  icon="mdi-account-plus"
                >
                </v-icon>
    
                <v-icon
                class="me-2"
                size="small"
                @click="removeProf(item)"
                icon="mdi-account-minus"
              >
              </v-icon>
    
              <v-icon
                class="me-2"
                size="small"
                @click="viewTeam(item)"
                icon="mdi-magnify"
              >
              </v-icon>
      
              <v-icon
                size="small"
                @click="deleteTeam(item)"
                icon="mdi-delete"
                >
              </v-icon>

            </div>
        </template>
  
        <template v-slot:no-data>
          <h1-text>Nenhum time cadastrado!</h1-text>
        </template>
      </v-data-table>
    </div>
  </template>
  
  
  <script>
    export default {
      data: () => ({
        dialog: false,
        dialogDelete: false,
        show: false,
        add: false,
        rem: false,
        newProf: '',
        headers: [
          {
            title: 'ID',
            align: 'start',
            sortable: true,
            key: 'id',
          },
          { title: 'Nome do Time', key: 'nomeTime'},
          { title: 'Ações', key: 'actions', align: 'center', width:150, sortable: false },
        ],
        times: [],
        profissionais: [],
        nomesProf: [],
        profsTime: [],
        editedIndex: -1,
        editedItem: {
          id: 0,
          nomeTime: '',
          idProfissionais: []
        },
        defaultItem: {
          id: 0,
          nomeTime: '',
          idProfissionais: []
        }
      }),

      watch: {
        dialog (val) {
          val || this.close()
        },
        dialogDelete (val) {
          val || this.closeDelete()
        },
      },
  
      mounted(){
          this.getProfissionais();
          this.getTimes();
      },
  
      methods: {

        getProfsNoTime(idTime) {
            this.profsTime = this.times
            .filter(time => time.id === idTime)
            .map(time => time.idProfissionais)
            .reduce((nomes, profissionais) => nomes.concat(profissionais.map(profissional => `${profissional.nome} - (${profissional.especialidade.descricao})`)), []);
        },

        getIDProf(nome){
            return this.profissionais.find(profissional => profissional.nome === nome).id;
        },

        getNomes(){
            this.nomesProf = [];
            this.profissionais.forEach(profissional => {
                this.nomesProf.push(profissional.nome);
            });
        },

        async getProfissionais() {
            const response = await fetch("http://54.173.113.77:8080/profissional");
            const data = await response.json();
            this.profissionais = data;
            this.getNomes();
        },
  
        // GET -> Obtem todos os times
        async getTimes() {
            const response = await fetch("http://54.173.113.77:8080/time");
            const data = await response.json();
            this.times = data;
        },
        
          
        // PUT -> Remove prof do time
        async putTimes(id_prof){

            const id_time = this.editedItem.id
            const req = await fetch(`http://54.173.113.77:8080/time/${id_time}/${id_prof}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"}
            });

            setTimeout(() => this.getTimes(), 500);
  
        },
    
        //DELETE -> Deletar um time
        async deleteTimes(id){
          const req = await fetch(`http://54.173.113.77:8080/time/${id}`, {
            method: "DELETE"
          });
  
          const res = await req.json();
  
          setTimeout(() => this.getTimes(), 500);
  
        },


        //POST/time -> Adicionar um time vazio
        async postTime(nome){

          const dado = {"nomeTime": nome}
          const dataJson = JSON.stringify(dado);
  
          const req = await fetch(`http://54.173.113.77:8080/time`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: dataJson
          });
  
          setTimeout(() => this.getTimes(), 500);
  
        },


        //POST/idTime/idProfissional -> Adicionar um prof ao time
        async postProfTime(id_prof){

            const id_time = this.editedItem.id
            const req = await fetch(`http://54.173.113.77:8080/time/${id_time}/${id_prof}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"}
            });

            setTimeout(() => this.getTimes(), 500);

        },



        required(inp){
          return !!inp || "Campo obrigatório"
        },
  

        addProf(item){
            this.editedIndex = this.times.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.add = true;
        },

        removeProf(item){
            this.editedIndex = this.times.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.getProfsNoTime(this.editedItem.id)
            this.rem = true;
        },


        viewTeam(item) {
          this.editedIndex = this.times.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.getProfsNoTime(this.editedItem.id);
          this.show = true
        },
  
        deleteTeam (item) {
          this.editedIndex = this.times.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.dialogDelete = true
        },
  
        deleteTeamConfirm () {
          this.deleteTimes(this.editedItem.id)
          this.closeDelete()
          this.getTimes()
        },
  
        close () {
          this.show = false
          this.dialog = false
          this.add = false
          this.rem = false
          this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
          })
          this.newProf = ''
        },
  
        closeDelete () {
          this.dialogDelete = false
          this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
          })
        },
  
        save () {
          if (this.add){
            const nome_prof = this.newProf.split(' - ')
            const id_prof = this.getIDProf(nome_prof[0])
            this.postProfTime(id_prof)
        
          } else if (this.rem){
            const nome_prof = this.newProf.split(' - ')
            const id_prof = this.getIDProf(nome_prof[0])
            this.putTimes(id_prof)

          } else {
              this.postTime(this.editedItem.nomeTime)
          }
          this.close()
        }
      }
    }
  
  </script>
  
  <style>
  
  .div-center{
      width: 90%;
      min-height: 70%;
      max-height: 90%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
  }
  
  </style>