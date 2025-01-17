import { Query as AuthQuery } from '@injectivelabs/chain-api/cosmos/auth/v1beta1/query_pb_service'
import {
  QueryAccountRequest,
  QueryAccountsRequest,
  QueryAccountsResponse,
  QueryAccountResponse,
  QueryParamsRequest,
  QueryParamsResponse,
} from '@injectivelabs/chain-api/cosmos/auth/v1beta1/query_pb'
import BaseConsumer from '../../BaseGrpcConsumer'
import { PaginationOption } from '../../../types/pagination'
import { paginationRequestFromPagination } from '../../../utils/pagination'
import { ChainGrpcAuthTransformer } from '../transformers/ChainGrpcAuthTransformer'
import { ChainModule } from '../types'
import { GrpcUnaryRequestException } from '@injectivelabs/exceptions'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcAuthApi extends BaseConsumer {
  protected module: string = ChainModule.Auction

  async fetchModuleParams() {
    const request = new QueryParamsRequest()

    try {
      const response = await this.request<
        QueryParamsRequest,
        QueryParamsResponse,
        typeof AuthQuery.Params
      >(request, AuthQuery.Params)

      return ChainGrpcAuthTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error)
    }
  }

  async fetchAccount(address: string) {
    const request = new QueryAccountRequest()

    request.setAddress(address)

    try {
      const response = await this.request<
        QueryAccountRequest,
        QueryAccountResponse,
        typeof AuthQuery.Account
      >(request, AuthQuery.Account)

      return ChainGrpcAuthTransformer.accountResponseToAccount(response)
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error)
    }
  }

  async fetchAccounts(pagination?: PaginationOption) {
    const request = new QueryAccountsRequest()
    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.setPagination(paginationForRequest)
    }

    try {
      const response = await this.request<
        QueryAccountsRequest,
        QueryAccountsResponse,
        typeof AuthQuery.Accounts
      >(request, AuthQuery.Accounts)

      return ChainGrpcAuthTransformer.accountsResponseToAccounts(response)
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error)
    }
  }
}
