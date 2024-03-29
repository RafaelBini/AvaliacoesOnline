import { Subscription } from 'rxjs/internal/Subscription';
import { GabaritoQuestaoComponent } from './../gabarito-questao/gabarito-questao.component';
import { OpcaoPreencher } from './../../models/opcao-preencher';
import { Alternativa } from './../../models/alternativa';
import { ComumService } from './../../services/comum.service';
import { Questao } from './../../models/questao';
import { ProvaService } from './../../services/prova.service';
import { Avaliacao } from './../../models/avaliacao';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Chart } from 'angular-highcharts';
import { SeriesOptionsType } from 'highcharts';

@Component({
  selector: 'app-estatisticas-avaliacao',
  templateUrl: './estatisticas-avaliacao.component.html',
  styleUrls: ['./estatisticas-avaliacao.component.css']
})
export class EstatisticasAvaliacaoComponent implements OnInit, OnDestroy {

  constructor(
    @Inject(MAT_DIALOG_DATA) public avaliacao: Avaliacao,
    private provaService: ProvaService,
    public comumService: ComumService,
    private dialog: MatDialog,
  ) { }


  public gruposQuestoes: GrupoQuestoes[] = [];
  public questoesGabarito: Questao[] = [];
  public carregado: boolean = false;
  private subscription: Subscription;

  ngOnInit(): void {
    this.comecarOuvirQuestoes();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  comecarOuvirQuestoes() {

    if (this.subscription == null)
      this.subscription = this.provaService.onProvasFromAvaliacaoChange(this.avaliacao.id).subscribe(provasFromAvaliacao => {
        console.log("Atualizando questões!!");
        this.gruposQuestoes = [];
        this.questoesGabarito = [];

        for (let [provaIndex, prova] of provasFromAvaliacao.entries()) {

          if (prova.isGabarito)
            for (let questao of prova.questoes)
              this.questoesGabarito[questao.index] = questao;

          else {
            for (let [questaoIndex, questao] of prova.questoes.entries()) {

              if (this.gruposQuestoes[questao.index] == undefined) {

                this.gruposQuestoes[questao.index] = {
                  questoes: [],
                  charts: [],
                  tipo: questao.tipo,
                  pergunta: questao.pergunta,
                  totalAcertos: 0,
                  totalAcertosParciais: 0,
                  totalErros: 0
                };
              }

              this.gruposQuestoes[questao.index].questoes.push(questao);
              if (this.comumService.questaoTipos[questao.tipo].getNota(questao, this.questoesGabarito[questao.index]) == questao.valor) {
                this.gruposQuestoes[questao.index].totalAcertos++;
              }
              else if (this.comumService.questaoTipos[questao.tipo].getNota(questao, this.questoesGabarito[questao.index]) <= 0) {
                this.gruposQuestoes[questao.index].totalErros++;
              }
              else {
                this.gruposQuestoes[questao.index].totalAcertosParciais++;
              }

            }
          }

        }
        // console.log(this.gruposQuestoes);

        this.receberCharts();
        this.carregado = true;

      });


  }

  receberCharts() {

    for (let [grupoQuestoesIndex, grupoQuestoes] of this.gruposQuestoes.entries()) {

      // GRÁFICO DE RESPOSTAS

      // ASSOCIAÇÃO
      if (grupoQuestoes.tipo == 0) {

        var datasets = [];
        var categories = [];

        for (let associacao of this.questoesGabarito[grupoQuestoesIndex].associacoes) {
          var data = [];
          categories.push(associacao.texto);
          for (let questao of grupoQuestoes.questoes) {
            for (let [associacaoRespostaIndex, associacaoResposta] of questao.associacoes.entries()) {
              if (data[associacaoRespostaIndex] == undefined)
                data[associacaoRespostaIndex] = 0;
              if (associacao.opcaoSelecionada == associacaoResposta.opcaoSelecionada)
                data[associacaoRespostaIndex]++;
            }
          }
          datasets.push({
            name: associacao.opcaoSelecionada,
            type: 'bar',
            data: data,
          });
        }


        var chart = new Chart({
          chart: {
            type: 'bar',
          },
          title: {
            text: null,
          },
          xAxis: {
            categories: categories,
            title: {
              text: null
            }
          },
          yAxis: {
            title: {
              text: 'Número de respostas dos alunos',
            },
            allowDecimals: false,
          },
          series: datasets,
        });
        grupoQuestoes.charts.push(chart);


        // console.log(grupoQuestoes.charts[0]);



      }
      // MULTIPLA-ESCOLHA
      else if (grupoQuestoes.tipo == 3 || grupoQuestoes.tipo == 4) {
        var datasets = [];
        var categories = [];

        for (let alternativa of this.questoesGabarito[grupoQuestoesIndex].alternativas) {
          var data = [];
          categories.push(alternativa.texto);
          for (let questao of grupoQuestoes.questoes) {
            for (let [alternativaRespostaIndex, alternativaResposta] of questao.alternativas.entries()) {
              if (data[alternativaRespostaIndex] == undefined)
                data[alternativaRespostaIndex] = 0;
              if (alternativaResposta.selecionada)
                data[alternativaRespostaIndex]++;
            }
          }
        }
        datasets.push({
          name: 'Resposta dos Alunos',
          type: 'bar',
          data: data,
        });


        var chart = new Chart({
          chart: {
            type: 'bar',
          },
          title: {
            text: null,
          },
          xAxis: {
            categories: categories,
            title: {
              text: null
            }
          },
          yAxis: {
            title: {
              text: 'Número de respostas dos alunos',
            },
            allowDecimals: false,
          },
          series: datasets,
        });
        grupoQuestoes.charts.push(chart);
      }
      // PREENCHIMENTO
      else if (grupoQuestoes.tipo == 5) {
        var datasets = [];
        var categories = [];

        for (let [opcaoPreencherIndex, opcaoPreencher] of this.questoesGabarito[grupoQuestoesIndex].opcoesParaPreencher.entries()) {

          if (!opcaoPreencher.ativa)
            continue;

          var data = [];
          categories.push(`(${opcaoPreencherIndex + 1})`);
          for (let questao of grupoQuestoes.questoes) {
            for (let [opcaoPreencherRespostaIndex, opcaoPreencherResposta] of questao.opcoesParaPreencher.entries()) {
              if (data[opcaoPreencherRespostaIndex] == undefined)
                data[opcaoPreencherRespostaIndex] = 0;
              if (opcaoPreencher.opcaoSelecionada == opcaoPreencherResposta.opcaoSelecionada)
                data[opcaoPreencherRespostaIndex]++;
            }
          }
          datasets.push({
            name: opcaoPreencher.opcaoSelecionada,
            type: 'bar',
            data: data,
          });
        }


        var chart = new Chart({
          chart: {
            type: 'bar',
          },
          title: {
            text: null,
          },
          xAxis: {
            categories: categories,
            title: {
              text: null
            }
          },
          yAxis: {
            title: {
              text: 'Número de respostas dos alunos',
            },
            allowDecimals: false,
          },
          series: datasets,
        });
        grupoQuestoes.charts.push(chart);
      }
      // VERDADEIRO OU FALSO
      else if (grupoQuestoes.tipo == 6 || grupoQuestoes.tipo == 7) {
        var series: any[] = [
          {
            name: 'Verdadeiro',
            type: 'bar',
            data: [],
          },
          {
            name: 'Falso',
            type: 'bar',
            data: [],
          },
        ];

        var categories = [];

        for (let alternativa of this.questoesGabarito[grupoQuestoesIndex].alternativas) {
          var dataVerdadeiro = [];
          var dataFalso = [];
          categories.push(alternativa.texto);
          for (let questao of grupoQuestoes.questoes) {
            for (let [alternativaRespostaIndex, alternativaResposta] of questao.alternativas.entries()) {
              if (dataVerdadeiro[alternativaRespostaIndex] == undefined) {
                dataVerdadeiro[alternativaRespostaIndex] = 0;
                dataFalso[alternativaRespostaIndex] = 0;
              }
              if (alternativaResposta.selecionada)
                dataVerdadeiro[alternativaRespostaIndex]++;
              else if (alternativaResposta.selecionada == false)
                dataFalso[alternativaRespostaIndex]++;
            }
          }
          series[0].data = dataVerdadeiro;
          series[1].data = dataFalso;


        }


        var chart = new Chart({
          chart: {
            type: 'bar',
          },
          title: {
            text: null,
          },
          xAxis: {
            categories: categories,
            title: {
              text: null
            }
          },
          yAxis: {
            title: {
              text: 'Número de respostas dos alunos',
            },
            allowDecimals: false,
          },
          series: series,
        });
        grupoQuestoes.charts.push(chart);
      }

      // GRAFICO DE ACERTOS
      var chart2 = new Chart({
        chart: {
          type: 'pie',
        },
        title: {
          text: null,
        },
        yAxis: {
          title: {
            text: 'Número de respostas dos alunos',
          },
          allowDecimals: false,
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y} ({point.percentage:.0f}%)</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            colors: ['#5fd15f', '#2395ff', '#ee3f3f'],
            dataLabels: {
              enabled: true,
              distance: this.comumService.isMobile() ? -50 : 10,
              // format: '<b>{point.name}</b>: {point.y} ({point.percentage:.0f}%) %',
              formatter: function () {
                if (this.y > 0) {
                  return `<b>${this.point.name}</b>: ${Math.floor(this.point.percentage)}%`;
                }
              }
            }
          }
        },
        series: [
          {
            name: 'Respostas',
            type: 'pie',
            data: [
              { name: 'Acertos', y: grupoQuestoes.totalAcertos },
              { name: 'Acertos Parciais', y: grupoQuestoes.totalAcertosParciais },
              { name: 'Erros', y: grupoQuestoes.totalErros }
            ]
          },
        ],
      });
      grupoQuestoes.charts.push(chart2);

    }
  }

  verGabarito(questaoIndex) {
    this.dialog.open(GabaritoQuestaoComponent, {
      data: this.questoesGabarito[questaoIndex],
      width: '70%',
      height: '70%',
    });
  }

  identificarQuestao(index: Number, questao: Questao) {
    return index;
  }

}

interface GrupoQuestoes {
  questoes: Questao[];
  totalAcertos: number;
  totalAcertosParciais: number;
  totalErros: number;
  charts: Chart[];
  tipo: number;
  pergunta: string;
}