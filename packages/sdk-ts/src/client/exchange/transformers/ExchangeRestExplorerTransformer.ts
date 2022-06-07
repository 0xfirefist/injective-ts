import { Block, ExplorerValidator } from '../types/explorer'
import {
  BlockFromExplorerApiResponse,
  BlockWithTxs,
  BaseTransaction,
  Transaction,
  TransactionFromExplorerApiResponse,
  ValidatorUptimeFromExplorerApiResponse,
  ExplorerValidatorUptime,
} from '../types/explorer-rest'

export class ExchangeRestExplorerTransformer {
  static blockToBlock(block: BlockFromExplorerApiResponse): Block {
    return {
      height: block.height,
      proposer: block.proposer,
      moniker: block.moniker,
      blockHash: block.block_hash,
      parentHash: block.parent_hash,
      numPreCommits: block.num_pre_commits,
      numTxs: block.num_txs,
      timestamp: block.timestamp,
    }
  }

  static blocksToBlocks(blocks: BlockFromExplorerApiResponse[]): Block[] {
    return blocks.map(ExchangeRestExplorerTransformer.blockToBlock)
  }

  static transactionToTransaction(
    transaction: TransactionFromExplorerApiResponse,
  ): Transaction {
    return {
      id: transaction.id,
      blockNumber: transaction.block_number,
      blockTimestamp: transaction.block_timestamp,
      hash: transaction.hash,
      code: transaction.code,
      info: transaction.info,
      memo: transaction.memo || '',
      gasWanted: transaction.gas_wanted,
      gasFee: {
        amounts: transaction.gas_fee?.amount,
        gasLimit: transaction.gas_fee?.gas_limit,
        payer: transaction.gas_fee?.payer,
        granter: transaction.gas_fee?.granter,
      },
      gasUsed: transaction.gas_used,
      codespace: transaction.codespace,
      signatures: transaction.signatures,
      txType: transaction.tx_type,
      data: transaction.data,
      events: transaction.events || [],
      messages: (transaction.messages || []).map((message) => ({
        type: message.type,
        message: message.value,
      })),
    }
  }

  static transactionsToTransactions(
    transactions: TransactionFromExplorerApiResponse[],
  ): Transaction[] {
    return transactions.map(
      ExchangeRestExplorerTransformer.transactionToTransaction,
    )
  }

  static blockWithTxToBlockWithTx(
    block: BlockFromExplorerApiResponse,
  ): BlockWithTxs {
    return {
      height: block.height,
      proposer: block.proposer,
      moniker: block.moniker,
      blockHash: block.block_hash,
      parentHash: block.parent_hash,
      numPreCommits: block.num_pre_commits,
      numTxs: block.num_txs,
      timestamp: block.timestamp,
      txs: block.txs
        ? ExchangeRestExplorerTransformer.transactionsToTransactions(block.txs)
        : [],
    }
  }

  static blocksWithTxsToBlocksWithTxs(
    blocks: BlockFromExplorerApiResponse[],
  ): BlockWithTxs[] {
    return blocks.map(ExchangeRestExplorerTransformer.blockWithTxToBlockWithTx)
  }

  static baseTransactionToTransaction(
    transaction: BaseTransaction,
  ): Transaction {
    return {
      ...transaction,
      messages: (transaction.messages || []).map((message) => ({
        type: (message as any).type,
        message: message.value,
      })),
      memo: transaction.memo || '',
    }
  }

  static validatorExplorerToValidator(
    validators: any[],
  ): Partial<ExplorerValidator>[] {
    return validators.map((validator) => {
      return {
        operatorAddress: validator.operator_address,
        proposed: validator.proposed,
        signed: validator.signed,
        missed: validator.missed,
        uptimePercentage: validator.uptime_percentage,
      }
    })
  }

  static validatorUptimeToExplorerValidatorUptime(
    validatorUptimeList: ValidatorUptimeFromExplorerApiResponse[],
  ): ExplorerValidatorUptime[] {
    return validatorUptimeList.map(
      (validatorUptime: ValidatorUptimeFromExplorerApiResponse) => ({
        blockNumber: validatorUptime.block_number,
        status: validatorUptime.status,
      }),
    )
  }
}