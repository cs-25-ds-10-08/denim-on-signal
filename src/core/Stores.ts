// Based on https://github.com/signalapp/libsignal-client/blob/main/node/ts/test/PublicAPITest.ts

import SignalLib = require('@signalapp/libsignal-client');;

export class InMemorySessionStore extends SignalLib.SessionStore {
    private state = new Map<string, Buffer>();
    async saveSession(
      name: SignalLib.ProtocolAddress,
      record: SignalLib.SessionRecord
    ): Promise<void> {
      const idx = name.name() + '::' + name.deviceId();
      Promise.resolve(this.state.set(idx, record.serialize()));
    }
    async getSession(
      name: SignalLib.ProtocolAddress
    ): Promise<SignalLib.SessionRecord | null> {
      const idx = name.name() + '::' + name.deviceId();
      const serialized = this.state.get(idx);
      if (serialized) {
        return Promise.resolve(
          SignalLib.SessionRecord.deserialize(serialized)
        );
      } else {
        return Promise.resolve(null);
      }
    }
    async getExistingSessions(
      addresses: SignalLib.ProtocolAddress[]
    ): Promise<SignalLib.SessionRecord[]> {
      return addresses.map(address => {
        const idx = address.name() + '::' + address.deviceId();
        const serialized = this.state.get(idx);
        if (!serialized) {
          throw 'no session for ' + idx;
        }
        return SignalLib.SessionRecord.deserialize(serialized);
      });
    }
  }
  
  export class InMemoryIdentityKeyStore extends SignalLib.IdentityKeyStore {
    private idKeys = new Map();
    private localRegistrationId: number;
    private identityKey: SignalLib.PrivateKey;
  
    constructor(localRegistrationId?: number) {
      super();
      this.identityKey = SignalLib.PrivateKey.generate();
      this.localRegistrationId = localRegistrationId ?? 5;
    }
  
    async getIdentityKey(): Promise<SignalLib.PrivateKey> {
      return Promise.resolve(this.identityKey);
    }
    async getLocalRegistrationId(): Promise<number> {
      return Promise.resolve(this.localRegistrationId);
    }
  
    async isTrustedIdentity(
      name: SignalLib.ProtocolAddress,
      key: SignalLib.PublicKey,
      _direction: SignalLib.Direction
    ): Promise<boolean> {
      const idx = name.name() + '::' + name.deviceId();
      if (this.idKeys.has(idx)) {
        const currentKey = this.idKeys.get(idx);
        return Promise.resolve(currentKey.compare(key) == 0);
      } else {
        return Promise.resolve(true);
      }
    }
  
    async saveIdentity(
      name: SignalLib.ProtocolAddress,
      key: SignalLib.PublicKey
    ): Promise<boolean> {
      const idx = name.name() + '::' + name.deviceId();
      const seen = this.idKeys.has(idx);
      if (seen) {
        const currentKey = this.idKeys.get(idx);
        const changed = currentKey.compare(key) != 0;
        this.idKeys.set(idx, key);
        return Promise.resolve(changed);
      }
  
      this.idKeys.set(idx, key);
      return Promise.resolve(false);
    }
    async getIdentity(
      name: SignalLib.ProtocolAddress
    ): Promise<SignalLib.PublicKey | null> {
      const idx = name.name() + '::' + name.deviceId();
      if (this.idKeys.has(idx)) {
        return Promise.resolve(this.idKeys.get(idx));
      } else {
        return Promise.resolve(null);
      }
    }
  }
  
  export class InMemoryPreKeyStore extends SignalLib.PreKeyStore {
    private state = new Map();
    async savePreKey(
      id: number,
      record: SignalLib.PreKeyRecord
    ): Promise<void> {
      Promise.resolve(this.state.set(id, record.serialize()));
    }
    async getPreKey(id: number): Promise<SignalLib.PreKeyRecord> {
      return Promise.resolve(
        SignalLib.PreKeyRecord.deserialize(this.state.get(id))
      );
    }
    async removePreKey(id: number): Promise<void> {
      this.state.delete(id);
      return Promise.resolve();
    }
  }
  
  export class InMemorySignedPreKeyStore extends SignalLib.SignedPreKeyStore {
    private state = new Map();
    async saveSignedPreKey(
      id: number,
      record: SignalLib.SignedPreKeyRecord
    ): Promise<void> {
      Promise.resolve(this.state.set(id, record.serialize()));
    }
    async getSignedPreKey(id: number): Promise<SignalLib.SignedPreKeyRecord> {
      return Promise.resolve(
        SignalLib.SignedPreKeyRecord.deserialize(this.state.get(id))
      );
    }
  }
  
  export class InMemorySenderKeyStore extends SignalLib.SenderKeyStore {
    private state = new Map();
    async saveSenderKey(
      sender: SignalLib.ProtocolAddress,
      distributionId: SignalLib.Uuid,
      record: SignalLib.SenderKeyRecord
    ): Promise<void> {
      const idx =
        distributionId + '::' + sender.name() + '::' + sender.deviceId();
      Promise.resolve(this.state.set(idx, record));
    }
    async getSenderKey(
      sender: SignalLib.ProtocolAddress,
      distributionId: SignalLib.Uuid
    ): Promise<SignalLib.SenderKeyRecord | null> {
      const idx =
        distributionId + '::' + sender.name() + '::' + sender.deviceId();
      if (this.state.has(idx)) {
        return Promise.resolve(this.state.get(idx));
      } else {
        return Promise.resolve(null);
      }
    }
  }