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
              max-width="80%"
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
                      <span class="text-h5">{{ formTitle }}</span>
                    </v-card-title>
        
                    <!-- Formulario de add/editar o time -->
                    <v-card-text>
                        <v-container>
                        <v-row justify="center">
                          <v-col
                            cols="12"
                            md="4"
                            sm="6"
                          >
                            <v-text-field
                              v-model="editedItem.nome"
                              label="Nome do Time"
                              :rules="[required]"
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
        editedIndex: -1,
        editedItem: {
          id: '',
          nomeTime: '',
          idProfissionais: []
        },
        defaultItem: {
          id: '',
          nomeTime: '',
          idProfissionais: []
        }
      }),
  
      computed: {
        formTitle () {
          return this.editedIndex === -1 ? 'Novo time' : 'Editar time'
        },
      },
  
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

        getIDProf(nome){
            return this.profissionais.find(profissional => profissional.nome === nome).id;
        },

        getNomes(){
            nomesProf = [];
            this.profissionais.forEach(profissional => {
                this.nomesProf.push(profissional.nome);
            });
        },

        async getProfissionais() {
            const response = await fetch("http://localhost:3000/profissional");
            const data = await response.json();
            this.profissionais = data;
            this.getNomes();
        },
  
        // GET -> Obtem todos os times
        async getTimes() {
            const response = await fetch("http://localhost:3000/time");
            const data = await response.json();
            this.times = data;
            console.log(this.times)
        },
        
          
        // PUT -> Remove prof do time
        async putTimes(item){
          const id_time = item.id
          
          const dataJson = JSON.stringify(item);
  
          const req = await fetch(`http://localhost:3000/time/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: dataJson
          });
  
          this.gettimes();
  
        },
    
        //DELETE -> Deletar um time
        async deletetimes(id){
          const req = await fetch(`http://localhost:3000/time/${id}`, {
            method: "DELETE"
          });
  
          const res = await req.json();
  
          this.gettimes();
  
        },
  
        //POST/time -> Adicionar um time vazio
        //POST/idTime/idProfissional -> Adicionar um prof ao time
        async postTimes(item){
          
          item.especialidade = this.getIDbyDesc(item.especialidade.descricao);
  
          const dataJson = JSON.stringify(item);
  
          const req = await fetch(`http://localhost:3000/time`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: dataJson
          });
  
          //this.getTimes();
  
        },
  
  
        required(inp){
          return !!inp || "Campo obrigatório"
        },
  
  
        viewTeam(item) {
          this.editedIndex = this.times.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.dialog = true
        },
  
        deleteTeam (item) {
          this.editedIndex = this.times.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.dialogDelete = true
        },
  
        deleteTeamConfirm () {
          this.times.splice(this.editedIndex, 1)
          this.closeDelete()
        },
  
        close () {
          this.dialog = false
          this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
          })
        },
  
        closeDelete () {
          this.dialogDelete = false
          //this.deleteTimes(this.editedItem.id)
          this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
          })
        },
  
        save () {
          if (this.editedIndex > -1) {
            Object.assign(this.times[this.editedIndex], this.editedItem)
            //this.putTimes(this.editedItem)
          }
          else {
            this.times.push(this.editedItem)
            //this.postTimes(this.editedItem)
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