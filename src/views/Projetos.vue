<template>
  <div style="min-height: 600px;">
    <v-data-table
      :headers="headers"
      :items="projetos"
      :sort-by="[{ key: 'id', order: 'asc' }]"
      fixed-header
      hover="true"
      class="div-center"
    >

      <template v-slot:top>
        <v-toolbar>
          <v-toolbar-title>Projetos</v-toolbar-title>
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
                Adicionar Projeto
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
  
              <!-- Formulario de add/editar o Projeto -->
              <v-card-text>
                  <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.id"
                        label="ID"
                        disabled
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.nomeProjeto"
                        label="Nome do Projeto"
                        :rules="[required]"
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.nomeCliente"
                        label="Cliente"
                        :rules="[required]"
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.objetivoProjeto"
                        label="Objetivo"
                        :rules="[required]"
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.dataInicio"
                        label="Data de Início"
                        placeholder="DD/MM/AAAA"
                        hint="Utilize o formato DD/MM/AAAA. Exemplo: 02/10/2001"
                        persistent-placeholder
                        :rules="[dataFormat]"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.dataFim"
                        label="Data de Término"
                        placeholder="DD/MM/AAAA"
                        hint="Utilize o formato DD/MM/AAAA. Exemplo: 02/10/2001"
                        persistent-placeholder
                        :rules="[dataFormat]"
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.valorProjeto"
                        label="Valor"
                        hint="Utilize '.' como separador de decimal. Exemplo: 1300.50"
                        :rules="[required]"
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-select
                      v-model="editedItem.timeResponsavel.nomeTime"
                      label="Time Responsável"
                      :items="nomes_times"
                      ></v-select>
                    </v-col>

                    <v-col
                    cols="12"
                    md="4"
                    sm="6"
                    >
                    <v-card
                    class="mx-auto"
                    max-width="300">

                    <v-list-subheader>Profissionais no Time</v-list-subheader>
                    <v-list :items="getProfsNoTime(editedItem.timeResponsavel.nomeTime)" variant="tonal" bg-color="#383131">
                    </v-list>
                    </v-card>
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
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="600px">
            <v-card>
              <v-card-title class="text-button text-center">Tem certeza que deseja excluir este Projeto?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
                <v-btn color="green-darken-1" variant="text" @click="deleteItemConfirm">Confirmar</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      
      <template v-slot:item.actions="{ item }">
        
        <v-icon
          class="me-2"
          size="small"
          @click="editItem(item)"
          icon="mdi-pencil"
        >
        </v-icon>

        <v-icon
          size="small"
          @click="deleteItem(item)"
          icon="mdi-delete"
          >
        </v-icon>
      </template>

      <template v-slot:no-data>
        <h1-text>Nenhum Projeto cadastrado!</h1-text>
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
        { title: 'Nome do Projeto', key: 'nomeProjeto' },
        { title: 'Cliente', key: 'nomeCliente' },
        { title: 'Início', key: 'dataInicio' },
        { title: 'Término', key: 'dataFim' },
        { title: 'Ações', key: 'actions', sortable: false },
      ],
      projetos: [],
      times: [],
      nomes_times: [],
      profsTime: [],
      editedIndex: -1,

      editedItem: {
        id: '',
        nomeProjeto: "",
        nomeCliente: "",
        objetivoProjeto: "",
        dataInicio: "",
        dataFim: "",
        valorProjeto: 0,
        timeResponsavel: {
          id: '',
          nomeTime: "",
          idProfissionais: []
        }
      },

      defaultItem: {
        id: '',
        nomeProjeto: "",
        nomeCliente: "",
        objetivoProjeto: "",
        dataInicio: "",
        dataFim: "",
        valorProjeto: 0,
        timeResponsavel: {
          id: '',
          nomeTime: " ",
          idProfissionais: []
        }
      }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Novo Projeto' : 'Editar Projeto'
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
      this.getTimes().then(() => {
        this.nomes_times = this.times.map(time => time.nomeTime);
        this.getProjetos();
    });
    },

    methods: {

      getProfsNoTime(nome_time) {
            return this.times
            .filter(time => time.nomeTime === nome_time)
            .map(time => time.idProfissionais)
            .reduce((nomes, profissionais) => nomes.concat(profissionais.map(profissional => `${profissional.nome} - (${profissional.especialidade.descricao})`)), []);
      },

      getIDTimeByName(nomeTime) {
        for (let i = 0; i < this.times.length; i++) {
          if (this.times[i].nomeTime === nomeTime) {
            return this.times[i].id;
          }
        }
        return null;
      },

      getTimeByNome(nomeTime) {
        for (let i = 0; i < this.times.length; i++) {
          if (this.times[i].nomeTime === nomeTime) {
            return this.times[i];
          }
        }
        return null;
      },

      async getTimes() {
            const response = await fetch("http://54.173.113.77:8080/time");
            const data = await response.json();
            this.times = data;
      },

      async getProjetos() {
          const response = await fetch("http://54.173.113.77:8080/projeto");
          const data = await response.json();
          this.projetos = data;
      },
        
      async putProjetos(item){

        const id_proj = item.id

        item.timeResponsavel = this.getTimeByNome(item.timeResponsavel.nomeTime);

        const dataJson = JSON.stringify(item);

        const req = await fetch(`http://54.173.113.77:8080/projeto/${id_proj}`, {
          method: "PUT",
          headers: {"Content-Type": "application/json"},
          body: dataJson,
        });

        setTimeout(() => this.getProjetos(), 500);

      },
  
      async deleteProjetos(id){
        const req = await fetch(`http://54.173.113.77:8080/projeto/${id}`, {
          method: "DELETE"
        });

        const res = await req.json();

        setTimeout(() => this.getProjetos(), 500);

      },

      async postProjetos(item){

        const item_post = Object.assign({}, item);

        const id_time = this.getIDTimeByName(item_post.timeResponsavel.nomeTime);

        delete item_post.timeResponsavel

        item_post.idTime = id_time

        const dataJson = JSON.stringify(item_post);

        const req = await fetch(`http://54.173.113.77:8080/projeto`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: dataJson
        });

        setTimeout(() => this.getProjetos(), 500);

      },

      
      dataFormat(date) {
        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
        return dateRegex.test(date) || 'Data deve estar no formato DD/MM/AAAA';
      },

      required(inp){
        return !!inp || "Campo obrigatório"
      },


      editItem (item) {
        this.editedIndex = this.projetos.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.projetos.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.deleteProjetos(this.editedItem.id)
        this.closeDelete()
        this.getProjetos()
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
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          this.putProjetos(this.editedItem)
        }
        else {
          this.postProjetos(this.editedItem)
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