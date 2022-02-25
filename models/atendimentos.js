
const moment = require('moment');
const conexao = require('./../infra/conexao');

class Atendimento {


    adiciona(atendimento, res) {

        console.log(atendimento);

        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS');
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');

        // validacoes
        const dataEhValida = moment(data).isSameOrAfter(dataCriacao);
        const clienteEhValido = atendimento.cliente.length >= 5;
        const validacoes = [
            {
                nome: 'data',
                valido: dataEhValida,
                mensagem: 'Data deve ser maior que a data atual'
            },
            {
                nome: 'cliente',
                valido: clienteEhValido,
                mensagem: 'O nome do cliente deve ter pelo menos 5 caracteres'
            }
        ];
        const erros = validacoes.filter(campo => !campo.valido);
        const existemErros = erros.length;

        if(existemErros) {
            res.status(400).json(erros);
        } else {
            const sql = 'INSERT INTO `atendimentos` (`id`, `cliente`, `pet`, `servico`, `dataCriacao`, `data`, `status`, `observacoes`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?);';
            const values = [atendimento.cliente, atendimento.pet, atendimento.servico, dataCriacao, data, atendimento.status, atendimento.observacoes];
            conexao.query(sql, values, (erro, resultados) => {
                if(erro) {
                    res.status(400).json(erro);
                } else {
                    res.status(201).json(atendimento);
                }
            });
        }
    }

    lista(res) {
        const sql = 'SELECT * FROM `atendimentos`';

        conexao.query(sql, (erro, resultados) => {

            console.log(resultados);

            if(erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json(resultados);
            }
        });
    }


    buscarPorId(id, res) {

        const sql = 'SELECT * FROM atendimentos WHERE id = ?';

        conexao.query(sql, id, (erro, resultado) => {

            const atendimento = resultado[0];

            if(erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json(atendimento);
            }

        });

    }

    altera(id, valores, res) {

        if(valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');
        }

        const sql = 'UPDATE `atendimentos` SET ? WHERE id=?';

        conexao.query(sql, [valores, id], (erro, resultados) => {

            if(erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json({...valores, id});
            }
        });

    }

    deleta(id, res) {
        const sql = 'DELETE FROM `atendimentos` WHERE id=?';

        conexao.query(sql, id, (erro, resultados) => {

            if(erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json({id});
            }


        });
    }

}

module.exports = new Atendimento;