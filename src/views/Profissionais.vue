<template>
  <div style="min-height: 600px;">
    <v-data-table
      :headers="headers"
      :items="profissionais"
      :sort-by="[{ key: 'id', order: 'asc' }]"
      fixed-header
      hover="true"
      class="div-center"
    >

      <template v-slot:top>
        <v-toolbar>
          <v-toolbar-title>Profissionais</v-toolbar-title>
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
                Adicionar Profissional
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
  
              <!-- Formulario de add/editar o profissional -->
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
                        v-model="editedItem.nome"
                        label="Nome"
                        :rules="[required]"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.endereço"
                        label="Endereço"
                        :rules="[required]"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.dataNasc"
                        label="Nascimento"
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
                        v-model="editedItem.genero"
                        label="Gênero"
                        :rules="[required]"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.raça
              "
                        label="Raça"
                        :rules="[required]"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      sm="6"
                    >
                      <v-select
                      label="Selecione a especialidade"
                      v-model="editedItem.especialidade.descricao"
                      :items="desc_especialidades"
                      :rules="[required]"
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
                  Salvar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="600px">
            <v-card>
              <v-card-title class="text-button text-center">Tem certeza que deseja excluir este profissional?</v-card-title>
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
        <h1-text>Nenhum profissional cadastrado!</h1-text>
      </template>
    </v-data-table>
  </div>
</template>


<script>
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      especialidades: [],
      desc_especialidades: [],
      headers: [
        {
          title: 'ID',
          align: 'start',
          sortable: true,
          key: 'id',
        },
        { title: 'Nome', key: 'nome' },
        { title: 'Especialidade', key: 'especialidade.descricao' },
        { title: 'Ações', key: 'actions', sortable: false },
      ],
      profissionais: [],
      editedIndex: -1,
      editedItem: {
        id: '',
        nome: '',
        endereço: '',
        genero: '',
        dataNasc: '',
        raça: '',
        especialidade: {
          id: 0,
          descricao: ''
        }
      },
      defaultItem: {
        id: '',
        nome: '',
        endereço: '',
        genero: '',
        dataNasc: '',
        raça: '',
        especialidade: {
          id: 0,
          descricao: ''
        }
      }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Novo Profissional' : 'Editar Profissional'
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
      this.getEspecialidades().then(() => {
        this.desc_especialidades = this.especialidades.map(esp => esp.descricao);
        this.getProfissionais();
    });
    },

    methods: {

      getIDbyDesc(desc){
        for (let i = 0; i < this.especialidades.length; i++) {
        if (this.especialidades[i].descricao === desc) {
            return this.especialidades[i].id;
          }
        }
        return -1;
      },

      async getEspecialidades() {
        const response = await fetch("http://backend:8080/especialidade");
        const data = await response.json();
        this.especialidades = data;
      },

      async getProfissionais() {
          const response = await fetch("http://backend:8080/profissional");
          const data = await response.json();
          this.profissionais = data;
      },
        
      async putProfissionais(item){
        const id = item.id
        
        const dataJson = JSON.stringify(item);

        const req = await fetch(`http://backend:8080/profissional/${id}`, {
          method: "PUT",
          headers: {"Content-Type": "application/json"},
          body: dataJson
        });

        this.getProfissionais();

      },
  
      async deleteProfissionais(id){
        const req = await fetch(`http://backend:8080/profissional/${id}`, {
          method: "DELETE"
        });

        const res = await req.json();

        this.getProfissionais();

      },

      async postProfissionais(item){
        
        item.especialidade = this.getIDbyDesc(item.especialidade.descricao);

        const dataJson = JSON.stringify(item);

        const req = await fetch(`http://backend:8080/profissional`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: dataJson
        });

        this.getProfissionais();

      },

      
      dataFormat(date) {
        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
        return dateRegex.test(date) || 'Data deve estar no formato DD/MM/AAAA';
      },

      required(inp){
        return !!inp || "Campo obrigatório"
      },


      editItem (item) {
        this.editedIndex = this.profissionais.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.profissionais.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.deleteProfissionais(this.editedItem.id)
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
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          this.putProfissionais(this.editedItem)
        }
        else {
          this.postProfissionais(this.editedItem)
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